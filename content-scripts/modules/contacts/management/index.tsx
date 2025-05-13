import { i18n } from '#i18n';

import { PaginatedContactsProvider, SelectedContactsProvider } from '../../../components/contacts-table';
import { UnifiedPinnablePortal } from '../../../components/unified-pinnable-portal';
import { ClosableModalDefaultProps } from '../../../contexts/modal-controller-context';
import { ContactsManagementView } from '../../../views/contacts-management';

export const ContactsModal = ({ isOpen, onClose }: ClosableModalDefaultProps) => {
  return (
    <PaginatedContactsProvider>
      <SelectedContactsProvider>
        <UnifiedPinnablePortal
          title={i18n.t('MODULES.CONTACTS.MENUS.MANAGEMENT')}
          modalStorageKey="wvt.modal.contacts"
          isOpen={isOpen}
          onClose={onClose}
          drawerWidth={720}
        >
          <ContactsManagementView />
        </UnifiedPinnablePortal>
      </SelectedContactsProvider>
    </PaginatedContactsProvider>
  );
};
