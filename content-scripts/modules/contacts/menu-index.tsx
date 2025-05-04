import { MenubarMenu } from '@components/menubar';

import { AccountValidateMenuItem } from './account-validate/menu-item';
import { ContactsMenuItem } from './management/menu-item';

export const AccountsMenu = () => {
  return (
    <MenubarMenu header="联系人">
      <ContactsMenuItem />
      <AccountValidateMenuItem />
    </MenubarMenu>
  );
};
