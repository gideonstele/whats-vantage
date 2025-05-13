import dayjs, { Dayjs } from 'dayjs';
import { trim } from 'lodash-es';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import { Flex, Form, Radio, TimePicker, Typography, UploadFile } from 'antd';

import { SelectMessageTemplate } from './components/select-message-template';
import { TemplateContent } from './components/template-content';
import { UploadAttachment } from './components/upload-attachment';

export interface SendMessageValues {
  templateId?: number;
  content?: string;
  attachments?: File[];
  sendTimeType?: 'immediately' | 'schedule';
  sendTime?: Dayjs;
}

export interface SendMessageRef {
  submit: () => Omit<Required<SendMessageValues>, 'templateId'> | undefined;
  reset: () => void;
}

export interface SendMessageViewProps {
  initialValues?: SendMessageValues;
  onEnableSubmitStateChange?: (isEnable: boolean) => void;
}

const sendTimeOptions = [
  { label: '立即发送', value: 'immediately' },
  { label: '定时发送', value: 'schedule' },
];
/**
 * Send Message Form View Fragment
 */
export const SendMessageView = forwardRef<SendMessageRef, SendMessageViewProps>(
  ({ initialValues, onEnableSubmitStateChange }, ref) => {
    const [form] = Form.useForm<SendMessageValues>();

    const attachments = useRef<File[]>([]);
    const setAttachments = useMemoizedFn((fileList: UploadFile[]) => {
      attachments.current = fileList.map((file) => file.originFileObj as File);
    });

    const handleTemplateChange = useMemoizedFn((templateContent: string) => {
      if (templateContent) {
        form.setFieldValue('content', templateContent);
        form.setFields([{ name: 'content', errors: [] }]);
      }
    });

    const handleContentChange = useMemoizedFn((value?: string) => {
      if (value) {
        form.setFieldValue('templateId', undefined);
      }
    });

    const sendTimeTypeField = Form.useWatch('sendTimeType', form);
    const contentField = Form.useWatch('content', form);
    const [shouldShowSendTime, setShouldShowSendTime] = useState(false);

    useEffect(() => {
      const enabled = !!(contentField && contentField.trim());
      onEnableSubmitStateChange?.(enabled);
    }, [contentField, onEnableSubmitStateChange]);

    useEffect(() => {
      if (sendTimeTypeField === undefined) {
        form.setFieldValue('sendTimeType', 'immediately');
        form.setFieldValue('sendTime', undefined);
      } else if (sendTimeTypeField === 'immediately') {
        setShouldShowSendTime(false);
        form.setFieldValue('sendTime', undefined);
      } else {
        setShouldShowSendTime(true);
        form.setFieldValue('sendTime', dayjs().add(5, 'minute'));
      }
    }, [form, sendTimeTypeField, shouldShowSendTime]);

    const validateSendTime = useMemoizedFn((_, value: Dayjs) => {
      const now = new Date();

      const hour = value.hour();
      const minute = value.minute();
      const second = value.second();

      const v = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, second);

      if (v.getTime() < now.getTime()) {
        return Promise.reject(new Error('发送时间不能小于当前时间'));
      } else {
        return Promise.resolve();
      }
    });

    useImperativeHandle(ref, () => ({
      submit: () => {
        const content = trim(form.getFieldValue('content'));
        if (!content) {
          form.setFields([{ name: 'content', errors: ['请输入模板内容'] }]);
          return;
        }

        return {
          content,
          attachments: attachments.current,
          sendTimeType: form.getFieldValue('sendTimeType'),
          sendTime: form.getFieldValue('sendTime'),
        };
      },
      reset: () => {
        form.resetFields();
      },
    }));

    return (
      <Form<SendMessageValues>
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item label="模板">
          <Flex
            justify="space-between"
            gap={8}
          >
            <Form.Item
              name="templateId"
              noStyle
            >
              <SelectMessageTemplate
                style={{ flex: 1 }}
                onTemplateChange={handleTemplateChange}
              />
            </Form.Item>
          </Flex>
        </Form.Item>
        <Form.Item label="模板内容">
          <Form.Item
            noStyle
            name="content"
            dependencies={['templateId']}
            rules={[{ required: true, message: '群发内容不能为空' }]}
          >
            <TemplateContent onChange={handleContentChange} />
          </Form.Item>
          <Typography.Paragraph type="secondary">
            消息中的 {'{{ xxx }}'} 将自动替换，如：{'{{name}}'},你好，自动替换为：姓名，你好。
            <br />
            您可以点击文本框前一行的快捷标签快速插入。
          </Typography.Paragraph>
        </Form.Item>
        <Form.Item label="附件">
          <UploadAttachment onChange={setAttachments} />
        </Form.Item>
        <Form.Item label="发送时间">
          <Form.Item
            noStyle
            name="sendTimeType"
          >
            <Radio.Group options={sendTimeOptions}></Radio.Group>
          </Form.Item>
          {shouldShowSendTime && (
            <Form.Item
              noStyle
              name="sendTime"
              rules={[
                {
                  validator: validateSendTime,
                },
              ]}
            >
              <TimePicker format="HH:mm" />
            </Form.Item>
          )}
        </Form.Item>
      </Form>
    );
  },
);
