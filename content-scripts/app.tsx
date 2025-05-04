import { MenubarLayout } from '@components/menubar';

import { IntegratedMenuLayout } from './components/layout-integrated-menu';
import { ModalsControllerProvider } from './contexts/modal-controller-context';
import { AccountsMenu } from './modules/contacts/menu-index';
import { AccountsCombinedProviders } from './modules/contacts/providers';
import { configModals } from './modules/modals';

export const ContentScriptsApp = () => {
  return (
    <AccountsCombinedProviders>
      <ModalsControllerProvider modals={configModals}>
        <IntegratedMenuLayout>
          <MenubarLayout>
            <AccountsMenu />
          </MenubarLayout>
        </IntegratedMenuLayout>
      </ModalsControllerProvider>
    </AccountsCombinedProviders>
  );
};
