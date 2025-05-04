import { usePaginatedContactsData, useSelectedContacts } from '../../../../components/contacts-table';
import { ExportContactsButton } from '../../../../components/export-contacts-button';
import { useQueryContacts } from '../../../../query/contacts';

export const ExportButton = ({ viewRef }: { viewRef: HTMLDivElement | undefined }) => {
  const { data: contacts, isLoading } = useQueryContacts(undefined);
  const { data: paginatedContacts } = usePaginatedContactsData();
  const { selectedContacts } = useSelectedContacts();

  return (
    <ExportContactsButton
      viewRef={viewRef}
      disabled={isLoading}
      allContacts={contacts?.data || []}
      paginatedContacts={paginatedContacts || []}
      selectedContacts={selectedContacts}
    />
  );
};
