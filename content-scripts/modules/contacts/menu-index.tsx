import { i18n } from '#i18n';

import { MenubarMenu } from '@components/menubar';

import { AccountValidateMenuItem } from './account-validate/menu-item';
import { ContactsMenuItem } from './management/menu-item';

export const AccountsMenu = () => {
  return (
    <MenubarMenu header={i18n.t('MODULES.CONTACTS.MENUS.INDEX')}>
      <ContactsMenuItem />
      <AccountValidateMenuItem />
    </MenubarMenu>
  );
};
