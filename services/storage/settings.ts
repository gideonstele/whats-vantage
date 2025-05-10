import { storage } from '#imports';

import { DailySettings } from 'types/domain/settings';
import { WppOptions } from 'types/options';

import { validateNumber } from './utils';

const DAILY_SEND_MAX_COUNT = 'sync:settings:daily-sent-max-count';
const DAILY_JOIN_GROUP_MAX_COUNT = 'sync:settings:daily-join-group-max-count';
const SEND_MESSAGE_INTERVAL = 'sync:settings:send-message-interval';
const ATTACHMENT_PER_TIME_LIMIT = 'sync:settings:attachment-per-time-limit';
const ATTACHMENT_MAX_SIZE = 'sync:settings:attachment-max-size';

/**
 * 每日发送最大次数限制
 */
export const StorageDailySendMaxCount = storage.defineItem<number>(DAILY_SEND_MAX_COUNT, {
  fallback: 100,
});

/**
 * 每日加入群聊最大次数限制
 */
export const StorageDailyJoinGroupMaxCount = storage.defineItem<number>(DAILY_JOIN_GROUP_MAX_COUNT, {
  fallback: 100,
});

/**
 * 附件上传最大大小限制
 */
export const StorageAttachmentMaxSize = storage.defineItem<number>(ATTACHMENT_MAX_SIZE, {
  fallback: 4096,
});

/**
 * 附件每次上传最大次数限制
 */
export const StorageAttachmentPerTimeLimit = storage.defineItem<number>(ATTACHMENT_PER_TIME_LIMIT, {
  fallback: 2,
});

/**
 * 发送消息间隔
 */
export const StorageSendMessageInterval = storage.defineItem<[number, number]>(SEND_MESSAGE_INTERVAL, {
  fallback: [10, 45],
});

/**
 * 设置每日发送最大次数限制
 */
export const setDailySendMaxCount = async (value: number) => {
  const validatedValue = validateNumber(value, 100, StorageDailySendMaxCount.fallback);
  await StorageDailySendMaxCount.setValue(validatedValue);
};

/**
 * 设置每日加入群聊最大次数限制
 */
export const setDailyJoinGroupMaxCount = async (value: number) => {
  const validatedValue = validateNumber(value, 100, StorageDailyJoinGroupMaxCount.fallback);
  await StorageDailyJoinGroupMaxCount.setValue(validatedValue);
};

export const setAttachmentMaxSize = async (value: number) => {
  const validatedValue = validateNumber(value, 4096, StorageAttachmentMaxSize.fallback);
  await StorageAttachmentMaxSize.setValue(validatedValue);
};

export const setAttachmentPerTimeLimit = async (value: number) => {
  const validatedValue = validateNumber(value, 5, StorageAttachmentPerTimeLimit.fallback);
  await StorageAttachmentPerTimeLimit.setValue(validatedValue);
};

export const setSendMessageInterval = async (value: [number, number]) => {
  const start = validateNumber(value[0], 0, StorageSendMessageInterval.fallback[0]);
  const end = validateNumber(value[1], 0, StorageSendMessageInterval.fallback[1]);

  if (start > end) {
    return;
  }

  await StorageSendMessageInterval.setValue([start, end]);
};

export const getAllSettings = async (): Promise<DailySettings> => {
  const [dailySendMaxCount, dailyJoinGroupMaxCount, attachmentMaxSize, attachmentPerTimeLimit, sendMessageInterval] =
    await Promise.all([
      StorageDailySendMaxCount.getValue(),
      StorageDailyJoinGroupMaxCount.getValue(),
      StorageAttachmentMaxSize.getValue(),
      StorageAttachmentPerTimeLimit.getValue(),
      StorageSendMessageInterval.getValue(),
    ]);

  return {
    dailySendMaxCount,
    dailyJoinGroupMaxCount,
    attachmentMaxSize,
    attachmentPerTimeLimit,
    sendMessageInterval,
  };
};

export const saveAllSettings = async (settings: WppOptions) => {
  await Promise.all([
    setDailySendMaxCount(settings.dailySendMaxCount),
    setDailyJoinGroupMaxCount(settings.dailyJoinGroupMaxCount),
    setAttachmentMaxSize(settings.attachmentMaxSize),
    setAttachmentPerTimeLimit(settings.attachmentPerTimeLimit),
    setSendMessageInterval(settings.sendMessageInterval),
  ]);
};
