import { MenubarItem } from '@components/menubar';

import { useModalController } from '../../../contexts/modal-controller-context';
import { ConfigModals } from '../../modals';

export const ContactsMenuItem = () => {
  const { open } = useModalController<ConfigModals>('contacts');

  return (
    <MenubarItem
      type="leaf"
      title="联系人管理"
      id="sw-assistant.menu-item.contacts-management"
      onClick={open}
    />
  );
};
