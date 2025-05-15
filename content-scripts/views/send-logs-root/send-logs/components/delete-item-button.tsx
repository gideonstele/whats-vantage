import { memo } from 'react';

import { Button, Popconfirm } from 'antd';
import { Trash2Icon } from 'lucide-react';

import { useMutationSendLogDelete } from '@content-scripts/query/send-logs';

export const DeleteItemButton = memo(({ id }: { id: number }) => {
  const { mutate: deleteItem, isPending } = useMutationSendLogDelete();

  return (
    <Popconfirm
      title="确定要删除该条消息发送记录吗？"
      description="删除后，该条消息发送记录将无法恢复"
      onConfirm={() => deleteItem(id)}
    >
      <Button
        variant="text"
        color="default"
        loading={isPending}
        icon={<Trash2Icon />}
        size="small"
      >
        删除
      </Button>
    </Popconfirm>
  );
});
