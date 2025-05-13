import { forwardRef, useRef } from 'react';

import { useBoolean, useMemoizedFn } from 'ahooks';
import { Button, GetRef, Modal, Skeleton } from 'antd';

import { useMutationMessageTemplateAdd } from '@content-scripts/query/message-templates';
import { TemplateEditor, TemplateEditorRef } from '@content-scripts/views/_message-template-editor';
import { useMessage } from '@hooks/use-message';

type ButtonRef = GetRef<typeof Button>;

export const TemplateAddButton = forwardRef<ButtonRef>((_, ref) => {
  const [isOpen, openAction] = useBoolean(false);

  const messageApi = useMessage();

  const editorRef = useRef<TemplateEditorRef>(null);
  const { mutate: addMessageTemplate, isPending } = useMutationMessageTemplateAdd();

  const handleConfirmAdd = useMemoizedFn(async () => {
    const value = await editorRef.current?.submit();

    if (value) {
      addMessageTemplate(value, {
        onSuccess: () => {
          messageApi.success('新增成功');
          openAction.setFalse();
        },
        onError: (error) => {
          messageApi.error(error.message || '新增失败');
        },
      });
    }
  });

  return (
    <>
      <Button
        ref={ref}
        type="primary"
        onClick={openAction.setTrue}
      >
        新增
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
        {isPending ? (
          <Skeleton
            active
            paragraph={{ rows: 5 }}
          />
        ) : (
          <TemplateEditor ref={editorRef} />
        )}
      </Modal>
    </>
  );
});
