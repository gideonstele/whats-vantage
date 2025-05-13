import { useRef } from 'react';

import { useBoolean, useMemoizedFn } from 'ahooks';
import { Button, ButtonProps, Modal, Skeleton } from 'antd';

import { useMutationMessageTemplateUpdate } from '@content-scripts/query/message-templates';
import { TemplateEditor, TemplateEditorRef } from '@content-scripts/views/_message-template-editor';
import { useMessage } from '@hooks/use-message';
import { MessageTemplateItem } from 'types/domain/message-templates';

export interface EditTemplateButtonProps extends Omit<ButtonProps, 'onClick' | 'children' | 'value'> {
  templateId: number;
  value: MessageTemplateItem;
}

export const EditTemplateButton = ({ templateId, value, ...restProps }: EditTemplateButtonProps) => {
  const messageApi = useMessage();
  const editorRef = useRef<TemplateEditorRef>(null);

  const [isOpen, openAction] = useBoolean(false);

  const { mutate: updateMessageTemplate, isPending } = useMutationMessageTemplateUpdate();

  const handleEditSubmit = useMemoizedFn(async () => {
    const value = await editorRef.current?.submit();

    if (value) {
      updateMessageTemplate(
        {
          id: templateId,
          item: value,
        },
        {
          onSuccess: () => {
            messageApi.success('编辑成功');
            openAction.setFalse();
          },
          onError: (error) => messageApi.error(error.message || '编辑失败'),
        },
      );
    }
  });

  return (
    <>
      <Button
        {...restProps}
        onClick={openAction.setTrue}
      >
        编辑
      </Button>
      <Modal
        open={isOpen}
        title="编辑模板"
        destroyOnHidden
        maskClosable={false}
        width={560}
        onCancel={openAction.setFalse}
        onClose={openAction.setFalse}
        onOk={handleEditSubmit}
        okText="保存"
        okButtonProps={{ loading: isPending }}
      >
        {isPending ? (
          <Skeleton
            active
            paragraph={{ rows: 5 }}
          />
        ) : (
          <TemplateEditor
            ref={editorRef}
            initialValues={value}
          />
        )}
      </Modal>
    </>
  );
};
