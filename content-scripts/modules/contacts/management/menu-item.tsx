import { i18n } from '#i18n';

import { MenubarItem } from '@components/menubar';

import { useModalController } from '../../../contexts/modal-controller-context';
import { ConfigModals } from '../../modals';

export const ContactsMenuItem = () => {
  const { open } = useModalController<ConfigModals>('contacts');

  return (
    <MenubarItem
      type="leaf"
      title={i18n.t('MODULES.CONTACTS.MENUS.MANAGEMENT')}
      id="wvt.menu-item.contacts-management"
      onClick={open}
    />
  );
};
