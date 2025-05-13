import { forwardRef, useImperativeHandle } from 'react';

import { useMemoizedFn } from 'ahooks';
import { Form, Input, Typography } from 'antd';

import { TemplateTextarea } from '@components/template-textarea';
import { useQueryCustomVariables } from '@content-scripts/query/custom-variables';
import { AddMessageTemplateItem } from 'types/db/message-templates';

export interface TemplateEditorRef {
  submit: () => Promise<AddMessageTemplateItem>;
  reset: () => void;
}

export interface TemplateEditorProps {
  initialValues?: AddMessageTemplateItem;
  onSubmit?: (value: AddMessageTemplateItem) => void;
  onError?: (error: Error) => void;
}

export const TemplateEditor = forwardRef<TemplateEditorRef, TemplateEditorProps>(
  ({ initialValues, onSubmit, onError }, ref) => {
    const { data: customVariables, isLoading } = useQueryCustomVariables();

    const [form] = Form.useForm<AddMessageTemplateItem>();

    const submit = useMemoizedFn(async () => {
      try {
        const value = await form.validateFields();

        if (!value.title) {
          value.title = value.content.split('\n')[0]?.slice(0, 10) || '未命名';
        }

        onSubmit?.(value);

        return value;
      } catch (error) {
        onError?.(error as Error);

        throw error;
      }
    });

    const reset = useMemoizedFn(() => {
      form.resetFields();
    });

    useImperativeHandle(ref, () => ({
      submit,
      reset,
    }));

    return (
      <Form<AddMessageTemplateItem>
        form={form}
        onFinish={submit}
        initialValues={initialValues}
        layout="vertical"
      >
        <Form.Item
          name="title"
          label="模板名称"
        >
          <Input placeholder="请为模板取一个名称（为空则自动填写）" />
        </Form.Item>
        <Form.Item label="模板内容">
          <Form.Item
            name="content"
            noStyle
          >
            <TemplateTextarea
              options={customVariables}
              isLoading={isLoading}
            />
          </Form.Item>
          <Typography.Paragraph type="secondary">
            消息中的 {'{{xxx}}'} 将自动替换，如：{'{{name}}'},你好，自动替换为：姓名，你好。
            <br />
            您可以点击文本框前一行的快捷标签快速插入。
          </Typography.Paragraph>
        </Form.Item>
      </Form>
    );
  },
);
