import { Flex } from 'antd';

import { useSelectedContacts } from '../../../components/contacts-table';
import { BulkSendMessageButton } from '../../_bulk-send-message-button';

import { BulkDeleteButton } from './operations/bulk-delete-button';
import { ExportButton } from './operations/export-button';

export const FooterOperations = ({ viewRef }: { viewRef?: HTMLDivElement | undefined }) => {
  const { selectedContacts } = useSelectedContacts();

  return (
    <Flex justify="space-between">
      <Flex
        justify="flex-start"
        flex={1}
      >
        <BulkDeleteButton />
      </Flex>
      <Flex
        justify="flex-end"
        flex={1}
        gap={4}
      >
        <BulkSendMessageButton contacts={selectedContacts} />
        <ExportButton viewRef={viewRef} />
      </Flex>
    </Flex>
  );
};
