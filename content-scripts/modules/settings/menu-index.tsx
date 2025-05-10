import { i18n } from '#i18n';

import { MenubarMenu } from '@components/menubar';

import { useModalController } from '../../contexts/modal-controller-context';
import { ConfigModals } from '../modals';

export const SettingsMenu = () => {
  const { open } = useModalController<ConfigModals>('settings');

  return (
    <MenubarMenu
      header={i18n.t('MODULES.SETTINGS.TITLE')}
      onClick={open}
    />
  );
};
