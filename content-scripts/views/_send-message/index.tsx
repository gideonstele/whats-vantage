/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dayjs } from 'dayjs';
import { trim } from 'lodash-es';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import { Button, Flex, Form, Radio, Select, TimePicker, Typography, Upload, UploadFile } from 'antd';
import { UploadChangeParam } from 'antd/es/upload';
import { UploadCloudIcon } from 'lucide-react';

import { TemplateTextarea } from '@components/template-textarea';

import { useAttachmentPerTimeLimit } from '../../external-stores/daily-used';

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
}

const sendTimeOptions = [
  { label: '立即发送', value: 'immediately' },
  { label: '定时发送', value: 'schedule' },
];

export const SendMessageView = forwardRef<SendMessageRef, SendMessageViewProps>(({ initialValues }, ref) => {
  const [form] = Form.useForm<SendMessageValues>();

  const attachments = useRef<File[]>([]);
  const setAttachments = useMemoizedFn((info: UploadChangeParam<UploadFile<any>>) => {
    attachments.current = info.fileList.map((file) => file.originFileObj as File);
  });

  const attachmentPerTimeLimit = useAttachmentPerTimeLimit();

  const sendTimeType = Form.useWatch('sendTimeType', form);
  const [shouldShowSendTime, setShouldShowSendTime] = useState(false);

  useEffect(() => {
    if (sendTimeType === undefined) {
      form.setFieldValue('sendTimeType', 'immediately');
    }
    if (sendTimeType === 'immediately') {
      setShouldShowSendTime(false);
      form.setFieldValue('sendTime', undefined);
    } else {
      setShouldShowSendTime(true);
    }
  }, [form, sendTimeType, shouldShowSendTime]);

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
            <Select style={{ flex: 1 }}></Select>
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
          <TemplateTextarea
            options={[]}
            isLoading={false}
          />
        </Form.Item>
        <Typography.Paragraph type="secondary">
          消息中的 {'{{ xxx }}'} 将自动替换，如：{'{{name}}'},你好，自动替换为：姓名，你好。
          <br />
          您可以点击文本框前一行的快捷标签快速插入。
        </Typography.Paragraph>
      </Form.Item>
      <Form.Item label="附件">
        <Upload
          accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
          multiple
          maxCount={attachmentPerTimeLimit}
          onChange={setAttachments}
          beforeUpload={() => {
            return false;
          }}
          listType="picture"
        >
          <Button icon={<UploadCloudIcon />}>上传附件</Button>
        </Upload>
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
});
