import { memo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { Button, Popconfirm, Tooltip, Typography } from 'antd';
import { Trash2Icon } from 'lucide-react';

import { useMessage } from '@hooks/use-message';

import { ContactsTable } from '../../../../components/contacts-table';
import { HoverWrapper } from '../../../../components/contacts-table/components/hover-items';
import { usePaginatedContactsData, useSelectedContacts } from '../../../../components/contacts-table/contexts/contacts';
import { useMutationContactDelete } from '../../../../query/contacts';

interface ContactTableProps {
  viewRef?: HTMLDivElement;
}

export const ContactTable = memo(({ viewRef }: ContactTableProps) => {
  const { mutate: deleteContact } = useMutationContactDelete();

  const messageApi = useMessage();

  const confirmDelete = useMemoizedFn((id: string) => {
    deleteContact(id, {
      onSuccess: () => {
        messageApi.success('删除成功');
      },
    });
  });

  const paginatedContactsData = usePaginatedContactsData();
  const { selectedContacts, setSelectedContacts } = useSelectedContacts();

  const dataSource = {
    ...paginatedContactsData,
    selectedData: selectedContacts,
    setSelectedData: setSelectedContacts,
  };

  const renderPhoneNumberAction = useMemoizedFn((record) => {
    if (record.isManualAdded) {
      return (
        <HoverWrapper>
          <Typography.Text>{record.phoneNumber}</Typography.Text>
          <Popconfirm
            title="确定要删除该联系人吗？"
            okText="删除"
            okButtonProps={{ danger: true }}
            onConfirm={() => confirmDelete(record.id)}
          >
            <Tooltip
              title="删除"
              trigger="hover"
            >
              <Button
                className="suffix"
                shape="circle"
                icon={<Trash2Icon />}
                size="small"
                type="text"
              />
            </Tooltip>
          </Popconfirm>
        </HoverWrapper>
      );
    }
    return <Typography.Text>{record.phoneNumber}</Typography.Text>;
  });

  return (
    <ContactsTable
      viewRef={viewRef}
      dataSource={dataSource}
      renderPhoneNumberAction={renderPhoneNumberAction}
    />
  );
});
