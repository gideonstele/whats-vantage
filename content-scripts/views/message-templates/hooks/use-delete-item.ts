import { useState } from 'react';

import { useMemoizedFn } from 'ahooks';

import { useMessage } from '@hooks/use-message';

import { useMutationMessageTemplateDelete } from '../../../query/message-templates';

export const useDeleteItem = () => {
  const { mutateAsync: deleteMessageTemplate, isPending: isDeleting } = useMutationMessageTemplateDelete();

  const messageApi = useMessage();
  const [deletingKey, setDeletingKey] = useState<number | undefined>(undefined);

  const handleDelete = useMemoizedFn(async (id: number) => {
    try {
      setDeletingKey(id);
      await deleteMessageTemplate(id);
      setDeletingKey(undefined);
      messageApi.success('删除模板成功');
    } catch (error) {
      messageApi.error((error as Error).message || '删除模板失败');
    }
  });

  return {
    deletingKey,
    handleDelete,
    isDeleting,
  };
};
