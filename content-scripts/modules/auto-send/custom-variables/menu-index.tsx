import { i18n } from '#i18n';

import { MenubarItem } from '@components/menubar';
import { ConfigModals } from '@content-scripts/modules/modals';

import { useModalController } from '../../../contexts/modal-controller-context';

export const CustomVariableMenuItem = () => {
  const { open } = useModalController<ConfigModals>('customVariables');

  return (
    <MenubarItem
      type="leaf"
      title={i18n.t('MODULES.CUSTOM_VARIABLES.TITLE')}
      onClick={open}
    />
  );
};
