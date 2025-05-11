import { MenubarLayout } from '@components/menubar';

import { IntegratedMenuLayout } from './components/layout-integrated-menu';
import { ModalsControllerProvider } from './contexts/modal-controller-context';
import { AutoSendMenu } from './modules/auto-send/menu-index';
import { AccountsMenu } from './modules/contacts/menu-index';
import { configModals } from './modules/modals';
import { SettingsMenu } from './modules/settings/menu-index';
import { AutoSendStatusModal } from './views/status-modal';

export const ContentScriptsApp = () => {
  return (
    <ModalsControllerProvider modals={configModals}>
      <IntegratedMenuLayout>
        <MenubarLayout>
          <AccountsMenu />
          <AutoSendMenu />
          <SettingsMenu />
        </MenubarLayout>
      </IntegratedMenuLayout>
      <AutoSendStatusModal />
    </ModalsControllerProvider>
  );
};
