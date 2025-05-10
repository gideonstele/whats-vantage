import { MenubarLayout } from '@components/menubar';

import { IntegratedMenuLayout } from './components/layout-integrated-menu';
import { ModalsControllerProvider } from './contexts/modal-controller-context';
import { AccountsMenu } from './modules/contacts/menu-index';
import { configModals } from './modules/modals';
import { SettingsMenu } from './modules/settings/menu-index';

export const ContentScriptsApp = () => {
  return (
    <ModalsControllerProvider modals={configModals}>
      <IntegratedMenuLayout>
        <MenubarLayout>
          <AccountsMenu />
          <SettingsMenu />
        </MenubarLayout>
      </IntegratedMenuLayout>
    </ModalsControllerProvider>
  );
};
