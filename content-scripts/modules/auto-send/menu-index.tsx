import { i18n } from '#i18n';

import { MenubarMenu } from '@components/menubar';

import { CustomVariableMenuItem } from './custom-variables/menu-index';
import { MessageTemplatesMenu } from './message-templates/menu-index';

export const AutoSendMenu = () => {
  return (
    <MenubarMenu header={i18n.t('MODULES.AUTO_SEND.TITLE')}>
      <CustomVariableMenuItem />
      <MessageTemplatesMenu />
    </MenubarMenu>
  );
};
