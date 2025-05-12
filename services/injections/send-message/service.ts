import dayjs from 'dayjs';

import { simplifyUserId } from '@services/helpers/contacts';
import { getFileMimeType, getWppFileType } from '@utils/file';
import { FormattedContact } from 'types/domain/contacts';
import { SendMessageItem, SendMessageResponse, SendMessageServiceSettings } from 'types/domain/send-message';

import { WppContentScriptsMessageSender } from '../../injected-messager';

import { mustacheRenderer } from './mustache-renderer';

/**
 * 消息发送结果的枚举类型
 */
enum SendMsgResult {
  OK = 'OK', // 发送成功
  ERROR_NETWORK = 'ERROR_NETWORK', // 网络错误
  ERROR_EXPIRED = 'ERROR_EXPIRED', // 过期错误
  ERROR_CANCELLED = 'ERROR_CANCELLED', // 取消错误
  ERROR_UPLOAD = 'ERROR_UPLOAD', // 上传错误
  ERROR_UNKNOWN = 'ERROR_UNKNOWN', // 未知错误
}

/**
 * `@wppconnect/wa-js` 的 `SendMessageReturn` 类型中，`sendMsgResult` 的类型为 `Promise<SendMsgResult>`，
 * 但是实际返回的类型为 `{ t: number; count: number | null; messageSendResult: SendMsgResult }`
 * 这个类型错误可能会在后续的版本中修复
 */
type FixedSendResult =
  | {
      t: number;
      count: number | null;
      messageSendResult: SendMsgResult;
    }
  | string;

/**
 * 消息发送服务类，用于处理WhatsApp消息的发送
 *
 * 运行流程：
 * start -> setCurrentItem -> processCurrentItem -> sendSingleText/sendSingleAttachment -> finishSend -> setCurrentToSuccess/setCurrentToError -> notifyUpdate -> setCurrentItem
 */
export class SendMessageService {
  private static instance: SendMessageService;

  /**
   * 获取单例实例
   * @param messageSender 消息发送器，用于与content scripts通信
   * @returns SendMessageService实例
   */
  static getInstance(messageSender: WppContentScriptsMessageSender) {
    if (!this.instance) {
      this.instance = new SendMessageService(messageSender);
    }
    return this.instance;
  }

  /**
   * 私有构造函数，确保只能通过getInstance方法获取实例
   * @param messageSender 消息发送器
   */
  private constructor(private readonly messageSender: WppContentScriptsMessageSender) {}

  public isProcessing = false; // 是否正在处理发送任务
  private remaining: SendMessageItem[] = []; // 剩余待发送的消息项
  private current: SendMessageItem | null = null; // 当前正在处理的消息项
  private success: SendMessageItem[] = []; // 成功发送的消息项
  private error: SendMessageItem[] = []; // 发送失败的消息项
  private currentTaskTimer: NodeJS.Timeout | null = null; // 当前任务定时器
  private scheduledTaskTimer: NodeJS.Timeout | null = null; // 定时任务定时器

  private settings: SendMessageServiceSettings | undefined; // 发送服务设置
  private currentMessage = ''; // 当前发送的文本消息
  private currentAttachmentFile: Blob[] = []; // 当前的附件文件列表
  private currentAttachmentSendIndex = 0; // 当前发送的附件索引

  /**
   * 通知状态更新，用于向content scripts发送当前处理状态
   */
  private notifyUpdate() {
    const detail = {
      isPending: this.isProcessing,
      remaining: this.remaining,
      current: this.current,
      success: this.success,
      error: this.error,
    };

    console.log('send-message-service:notifyUpdate', detail);

    this.messageSender('content-scripts:send-message:update-all', detail);
  }

  /**
   * 通知任务完成
   */
  private notifyComplete() {
    console.log('send-message-service:notifyComplete');

    this.messageSender('content-scripts:send-message:complete', undefined);
  }

  /**
   * 重置所有状态
   */
  private reset() {
    this.remaining = [];
    this.current = null;
    this.success = [];
    this.error = [];
    this.isProcessing = false;

    if (this.currentTaskTimer) {
      clearTimeout(this.currentTaskTimer);
      this.currentTaskTimer = null;
    }

    if (this.scheduledTaskTimer) {
      clearTimeout(this.scheduledTaskTimer);
      this.scheduledTaskTimer = null;
    }
  }

  /**
   * 设置当前处理项，从队列中取出下一个待发送项
   */
  private async setCurrentItem() {
    const item = this.remaining.shift();
    if (item) {
      this.current = {
        ...item,
        status: 'processing',
      };
      const result = await this.validateSendMessage();
      if (!result) {
        return false;
      }
      if (this.isProcessing) {
        this.processCurrentItem();
      }
      this.notifyUpdate();
    } else {
      // 没有剩余项，任务完成
      this.isProcessing = false;
      this.notifyComplete();
    }
  }

  /**
   * 将当前项标记为发送成功
   * @param sendRenderedMessage 发送的渲染后消息内容
   */
  private setCurrentToSuccess(sendRenderedMessage?: string) {
    if (this.current) {
      this.success.push({
        ...this.current,
        status: 'success',
        tried: true,
        message: sendRenderedMessage || '',
      });

      this.messageSender('content-scripts:send-message:add-statistics', {
        success: true,
        attachmentCount: this.currentAttachmentFile.length,
        contact: this.current!.contact,
        message: sendRenderedMessage || this.currentMessage,
      });

      this.current = null;
      this.notifyUpdate();
      this.setCurrentItem();
    }
  }

  /**
   * 将当前项标记为发送失败
   * @param reason 失败原因
   */
  private setCurrentToError(reason: string) {
    if (this.current) {
      this.error.push({
        ...this.current,
        status: 'failed',
        errorReason: reason,
        tried: true,
      });

      this.messageSender('content-scripts:send-message:add-statistics', {
        success: false,
        attachmentCount: this.currentAttachmentFile.length,
        contact: this.current!.contact,
        message: reason || this.currentMessage,
      });

      this.current = null;
      this.notifyUpdate();
      this.setCurrentItem();
    }
  }

  /**
   * 验证消息发送是否符合限制条件
   * @returns 是否通过验证
   */
  async validateSendMessage(): Promise<boolean> {
    const { settings, used } = this.settings!;

    const sendCount = used.dailySentCount || 0;

    // 检查是否超过每日发送上限
    if (sendCount > (settings.dailySendMaxCount || 1000)) {
      this.error = this.remaining.map((item) => ({
        ...item,
        status: 'failed',
        errorReason: '发送次数超过每日上限',
      }));
      this.isProcessing = false;
      this.notifyUpdate();
      this.reset();
      return false;
    }

    return true;
  }

  /**
   * 启动消息发送任务
   * @param content 消息内容
   * @param files 附件文件列表
   * @param contacts 联系人列表
   * @param settings 发送服务设置
   * @param delayTime 定时发送时间（HH:mm格式）
   * @returns 发送响应状态
   */
  async start(
    content: string,
    files: Blob[],
    contacts: FormattedContact[],
    settings: SendMessageServiceSettings,
    delayTime?: string,
  ): Promise<SendMessageResponse> {
    this.settings = settings;
    this.currentMessage = content;
    this.currentAttachmentFile = files;
    this.currentAttachmentSendIndex = 0;

    // 为每个联系人创建一个待发送项
    const items: SendMessageItem[] = contacts.map((contact) => ({
      id: contact.id,
      contact,
      message: content,
      status: 'pending',
      attachmentCount: files.length,
    }));

    this.remaining = items;
    this.current = null;
    this.success = [];
    this.error = [];
    this.isProcessing = true;

    // 处理定时发送
    if (delayTime) {
      const shouldSchedule = this.scheduleMessageSending(delayTime);
      if (shouldSchedule) {
        // 通知用户消息已被安排在将来发送
        this.messageSender('content-scripts:send-message:scheduled', {
          scheduledTime: delayTime,
          contactCount: contacts.length,
        });
        return 'scheduled';
      }
    }

    // 立即开始发送
    const result = await this.setCurrentItem();
    if (result === false) {
      return 'error';
    }
    // this.messageSender('content-scripts:send-message:immediate', {
    //   contactCount: contacts.length,
    // });
    return 'processing';
  }

  /**
   * 安排定时发送消息
   * @param delayTime 定时发送的时间（HH:mm格式）
   * @returns 是否成功安排定时发送任务
   */
  private scheduleMessageSending(delayTime: string): boolean {
    console.log('delayTime', delayTime);

    // 解析定时发送的时间
    const [hours, minutes] = delayTime.split(':').map(Number);
    const now = dayjs();
    const scheduledTime = dayjs().hour(hours).minute(minutes).second(0);

    // 如果指定时间小于等于当前时间，不需要安排定时任务
    if (scheduledTime.isSame(now) || scheduledTime.isBefore(now)) {
      return false;
    }

    // 计算延迟的毫秒数
    const delayMs = scheduledTime.diff(now, 'ms');

    // 安排定时任务
    if (this.scheduledTaskTimer) {
      clearTimeout(this.scheduledTaskTimer);
    }

    this.scheduledTaskTimer = setTimeout(() => {
      // 时间到了，开始执行发送任务
      console.log('send-message-service:scheduled-time-reached', { scheduledTime: delayTime });
      this.setCurrentItem();
    }, delayMs);

    console.log('send-message-service:scheduled', {
      scheduledTime: delayTime,
      delayMs,
      contactCount: this.remaining.length,
    });

    return true;
  }

  /**
   * 处理当前发送项
   */
  private async processCurrentItem(): Promise<void> {
    // 计算发送延迟时间（随机范围内）
    const [minInterval, maxInterval] = this.settings?.settings.sendMessageInterval || [0, 1];
    const delay = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;

    if (this.currentTaskTimer) {
      clearTimeout(this.currentTaskTimer);
    }

    console.log('send-message-service:processCurrentItem', delay, this.current);

    this.currentTaskTimer = setTimeout(async () => {
      if (!this.current?.contact.id) {
        return;
      }

      const id = simplifyUserId(this.current.contact.id);

      console.debug('send-message-service:processCurrentItem:simplifyUserId', id);

      /*
       * -- 20250423 联系人查询是否存在返回结果不准确，先关闭此功能
      try {
        const [exists, queryExists] = await Promise.all([
          window.WPP.contact.get(id),
          window.WPP.contact.queryExists(id),
        ]);
        if (!exists && !queryExists) {
          this.setCurrentToError('联系人不存在');
          return;
        }
      } catch (_error) {
        this.setCurrentToError('联系人不存在，请检查号码是否合法');
        return;
      }
      */

      // 根据是否有附件决定发送方式
      if (
        this.currentAttachmentFile.length > 0 &&
        this.currentAttachmentSendIndex < this.currentAttachmentFile.length
      ) {
        await this.sendSingleAttachment();
      } else {
        await this.sendSingleText();
      }
    }, delay * 1000);
  }

  /**
   * 发送单个附件
   */
  private async sendSingleAttachment() {
    // 如果是第一个附件，先发送文本消息
    if (this.currentAttachmentSendIndex === 0) {
      await this.sendTextMessageOnly(this.currentMessage, this.current!.contact);
    }

    const file = this.currentAttachmentFile[this.currentAttachmentSendIndex];
    const [fileType, ext] = await getWppFileType(file);
    const mimeType = await getFileMimeType(file);

    try {
      // 使用WhatsApp API发送文件
      const result = await window.WPP.chat.sendFileMessage(this.current!.contact.id, file, {
        mimetype: mimeType,
        type: fileType,
        filename: `${Date.now()}-${this.currentAttachmentSendIndex}.${ext}`,
      });

      const sendResponse = (await result.sendMsgResult) as unknown as FixedSendResult;
      this.finishSend(sendResponse);
    } catch (error) {
      this.setCurrentToError((error as Error).message);
    }
  }

  /**
   * 仅发送文本消息
   * @param template 消息模板
   * @param contact 联系人
   * @param data 模板数据
   * @returns 发送结果
   */
  private async sendTextMessageOnly(template: string, contact: FormattedContact) {
    const data = {
      currentUser: {
        username: contact.name,
        phoneNumber: contact.phoneNumber || '',
        callname: contact.name,
      },
      common: {
        currentTime: dayjs().format('HH:mm'),
        currentDate: dayjs().format('YYYY-MM-DD'),
      },
    };

    // 使用Mustache渲染模板
    const message = mustacheRenderer(template, data);

    try {
      // 使用WhatsApp API发送文本消息
      const result = await window.WPP.chat.sendTextMessage(contact.id, message, {
        createChat: true,
      });
      const status = (await result.sendMsgResult) as unknown as FixedSendResult;
      return { status, message };
    } catch (error) {
      return { status: SendMsgResult.ERROR_UNKNOWN, message, errorMessage: (error as Error).message };
    }
  }

  /**
   * 发送单条文本消息
   */
  private async sendSingleText() {
    if (!this.current) {
      return;
    }

    const result = await this.sendTextMessageOnly(this.currentMessage, this.current.contact);

    this.finishSend(result.status, result.message);
  }

  /**
   * 完成发送处理
   * @param response 发送响应
   * @param sendRenderedMessage 渲染后的发送消息
   */
  private async finishSend(response: FixedSendResult, sendRenderedMessage?: string) {
    const _response = typeof response === 'string' ? response : response.messageSendResult;

    // 有附件的情况
    if (this.currentAttachmentFile.length > 0) {
      // 当前联系人附件发送完毕
      if (this.currentAttachmentSendIndex + 1 === this.currentAttachmentFile.length) {
        if (_response === SendMsgResult.OK) {
          this.setCurrentToSuccess(sendRenderedMessage);
        } else {
          this.setCurrentToError('附件发送失败');
        }
      } else {
        // 当前联系人附件未发送完毕, 发送下一个附件
        this.currentAttachmentSendIndex++;
        this.sendSingleAttachment();
      }
    } else {
      // 没有附件的情况

      if (_response === SendMsgResult.OK) {
        this.setCurrentToSuccess();
      } else {
        this.setCurrentToError('文本发送失败');
      }
    }
  }

  /**
   * 停止消息发送任务
   */
  stop() {
    if (this.isProcessing) {
      this.reset();
      this.notifyComplete();
    }
  }
}
