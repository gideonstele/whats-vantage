import { useMemoizedFn } from 'ahooks';
import { Button, Popconfirm } from 'antd';
import { Trash2Icon } from 'lucide-react';

import { useSelectedContacts } from '../../../../components/contacts-table';
import { useMutationContactsBulkDelete } from '../../../../query/contacts';

export const BulkDeleteButton = () => {
  const { mutate: bulkDeleteContacts, isPending: isBulkDeleteContactsPending } = useMutationContactsBulkDelete();
  const { selectedContacts, setSelectedContacts } = useSelectedContacts();

  const disabled = selectedContacts.length === 0 || isBulkDeleteContactsPending;

  const handleBulkDelete = useMemoizedFn(() => {
    bulkDeleteContacts(
      selectedContacts.map((contact) => contact.id),
      {
        onSuccess: () => {
          setSelectedContacts([]);
        },
      },
    );
  });

  return (
    <Popconfirm
      title="确定要删除这些联系人吗？"
      onConfirm={handleBulkDelete}
      okButtonProps={{ loading: isBulkDeleteContactsPending }}
      cancelButtonProps={{ disabled: isBulkDeleteContactsPending }}
      okText="确定"
      cancelText="取消"
    >
      <Button
        variant="filled"
        color="default"
        disabled={disabled}
        icon={<Trash2Icon />}
        loading={isBulkDeleteContactsPending}
      >
        批量删除
      </Button>
    </Popconfirm>
  );
};
