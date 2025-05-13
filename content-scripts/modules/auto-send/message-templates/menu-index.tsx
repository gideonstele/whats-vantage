import { i18n } from '#i18n';

import { MenubarItem } from '@components/menubar';

import { useModalController } from '../../../contexts/modal-controller-context';
import { ConfigModals } from '../../modals';

export const MessageTemplatesMenu = () => {
  const { open } = useModalController<ConfigModals>('messageTemplates');

  return (
    <MenubarItem
      type="leaf"
      title={i18n.t('MODULES.AUTO_SEND.MESSAGE_TEMPLATES.TITLE')}
      onClick={open}
    />
  );
};
