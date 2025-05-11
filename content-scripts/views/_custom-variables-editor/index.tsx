import { forwardRef, useImperativeHandle } from 'react';

import { useMemoizedFn } from 'ahooks';
import { Form, Input } from 'antd';

import { CustomVariablesItem } from 'types/db/custom-variables';

export interface CustomVariableEditorRef {
  submit: () => Promise<CustomVariablesItem>;
  reset: () => void;
}

export interface CustomVariableEditorProps {
  initialValues?: CustomVariablesItem;
  onSubmit?: (value: CustomVariablesItem) => void;
  onError?: (error: Error) => void;
}

export const CustomVariableEditor = forwardRef<CustomVariableEditorRef, CustomVariableEditorProps>(
  ({ initialValues, onSubmit, onError }, ref) => {
    const [form] = Form.useForm<CustomVariablesItem>();

    const submit = useMemoizedFn(async () => {
      try {
        const value = await form.validateFields();
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
      <Form<CustomVariablesItem>
        form={form}
        onFinish={onSubmit}
        initialValues={initialValues}
        layout="vertical"
      >
        <Form.Item
          name="label"
          label="变量名称"
        >
          <Input placeholder="请输入变量名称" />
        </Form.Item>
        <Form.Item
          name="value"
          label="变量值"
        >
          <Input placeholder="请输入变量值" />
        </Form.Item>
        <Form.Item
          name="description"
          label="变量描述"
        >
          <Input.TextArea
            placeholder="您可以在在这里解释它的用途等信息"
            rows={4}
          />
        </Form.Item>
      </Form>
    );
  },
);
