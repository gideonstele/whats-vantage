import { forwardRef, useRef } from 'react';

import { useBoolean, useMemoizedFn } from 'ahooks';
import { Button, GetRef, Modal } from 'antd';

import { useMutationCustomVariableAdd } from '@content-scripts/query/custom-variables';
import { useMessage } from '@hooks/use-message';

import { CustomVariableEditor, CustomVariableEditorRef } from '../../_custom-variables-editor';

type ButtonRef = GetRef<typeof Button>;

export interface CustomVariableAddButtonProps {
  title?: string;
}

export const CustomVariableAddButton = forwardRef<ButtonRef, CustomVariableAddButtonProps>(
  ({ title = '新增自定义变量' }, ref) => {
    const [isOpen, openAction] = useBoolean(false);

    const messageApi = useMessage();

    const editorRef = useRef<CustomVariableEditorRef>(null);
    const { mutate: addCustomVariable, isPending } = useMutationCustomVariableAdd();

    const handleConfirmAdd = useMemoizedFn(async () => {
      try {
        const value = await editorRef.current?.submit();

        if (value) {
          addCustomVariable(value, {
            onSuccess: () => {
              messageApi.success('新增成功');
              openAction.setFalse();
            },
            onError: (error) => {
              messageApi.error(error.message || '新增失败');
            },
          });
        }
      } catch (error) {
        messageApi.error((error as Error).message || '新增失败');
      }
    });

    return (
      <>
        <Button
          ref={ref}
          type="primary"
          onClick={openAction.setTrue}
        >
          {title}
        </Button>
        <Modal
          title="新增消息模板"
          open={isOpen}
          destroyOnHidden
          maskClosable={false}
          width={560}
          okText="新增"
          cancelText="取消"
          okButtonProps={{ loading: isPending }}
          onOk={handleConfirmAdd}
          onCancel={openAction.setFalse}
          onClose={openAction.setFalse}
        >
          <CustomVariableEditor ref={editorRef} />
        </Modal>
      </>
    );
  },
);
