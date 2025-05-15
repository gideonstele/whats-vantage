import { memo, useMemo } from 'react';

import { Button, Popconfirm } from 'antd';
import { Trash2Icon } from 'lucide-react';

import { useMutationSendLogsBulkDelete, useMutationSendLogsClear } from '@content-scripts/query/send-logs';

import { useLogsData } from '../providers/data';

export const ClearAllButton = memo(() => {
  const { mutate: clearAll, isPending } = useMutationSendLogsClear();
  const { mutate: bulkDelete, isPending: isBulkDeletePending } = useMutationSendLogsBulkDelete();

  const { selectedLogs } = useLogsData();

  const renderSelectedLogs = useMemo(
    () => (
      <Popconfirm
        title="确定要批量删除所有消息发送记录吗？"
        description="清空后，消息发送记录将无法恢复"
        okButtonProps={{
          loading: isPending,
          color: 'default',
          variant: 'text',
        }}
        cancelButtonProps={{
          color: 'default',
          variant: 'text',
        }}
        okText="确认，删除选中项"
        cancelText="取消"
        onConfirm={() => bulkDelete(selectedLogs.map((log) => log.id))}
      >
        <Button
          variant="text"
          color="default"
          loading={isBulkDeletePending}
          icon={<Trash2Icon />}
        >
          删除选中项
        </Button>
      </Popconfirm>
    ),
    [bulkDelete, isBulkDeletePending, isPending, selectedLogs],
  );

  const renderClearAll = useMemo(
    () => (
      <Popconfirm
        title="确定要清空所有消息发送记录吗？"
        description="清空后，消息发送记录将无法恢复"
        okButtonProps={{
          loading: isPending,
          color: 'default',
          variant: 'text',
        }}
        cancelButtonProps={{
          color: 'default',
          variant: 'text',
        }}
        okText="确认，清空"
        cancelText="取消"
        onConfirm={() => clearAll()}
      >
        <Button
          variant="text"
          color="default"
          loading={isPending}
          icon={<Trash2Icon />}
        >
          清空
        </Button>
      </Popconfirm>
    ),
    [clearAll, isPending],
  );

  return selectedLogs?.length ? renderSelectedLogs : renderClearAll;
});
