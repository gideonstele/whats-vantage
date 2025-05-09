import { UnifiedPinnablePortal } from '../../../components/unified-pinnable-portal';
import { ClosableModalDefaultProps } from '../../../contexts/modal-controller-context';
import { ContactsManagementView } from '../../../views/contacts-management';

export const ContactsModal = ({ isOpen, onClose }: ClosableModalDefaultProps) => {
  return (
    <UnifiedPinnablePortal
      title="联系人管理"
      modalStorageKey="wvt.modal.contacts"
      isOpen={isOpen}
      onClose={onClose}
      drawerWidth={720}
    >
      <ContactsManagementView />
    </UnifiedPinnablePortal>
  );
};
