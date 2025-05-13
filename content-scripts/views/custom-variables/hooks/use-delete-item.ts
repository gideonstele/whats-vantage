import { useState } from 'react';

import { useMemoizedFn } from 'ahooks';

import { useMutationCustomVariableDelete } from '@content-scripts/query/custom-variables';
import { useMessage } from '@hooks/use-message';

export const useDeleteItem = () => {
  const messageApi = useMessage();
  const { mutateAsync: deleteCustomVariable, isPending: isDeleting } = useMutationCustomVariableDelete();

  const [deletingKey, setDeletingKey] = useState<number | undefined>(undefined);

  const handleDelete = useMemoizedFn(async (id: number) => {
    try {
      setDeletingKey(id);
      await deleteCustomVariable(id);
      setDeletingKey(undefined);
      messageApi.success('删除变量成功');
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
