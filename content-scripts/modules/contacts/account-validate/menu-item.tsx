import { i18n } from '#i18n';

import { MenubarItem } from '@components/menubar';

import { useModalController } from '../../../contexts/modal-controller-context';
import { ConfigModals } from '../../modals';

export const AccountValidateMenuItem = () => {
  const { open } = useModalController<ConfigModals>('accountValidate');

  return (
    <MenubarItem
      type="leaf"
      title={i18n.t('MODULES.CONTACTS.MENUS.ACCOUNT_VALIDATE')}
      onClick={open}
    ></MenubarItem>
  );
};
