import { i18n } from '#i18n';

import { UnifiedPinnablePortal } from '../../components/unified-pinnable-portal';
import { ClosableModalDefaultProps } from '../../contexts/modal-controller-context';
import { ModalBodyViewLayout } from '../../views/_/layout';
import { SettingsView } from '../../views/settings';

export const SettingsModal = ({ isOpen, onClose }: ClosableModalDefaultProps) => {
  return (
    <UnifiedPinnablePortal
      title={i18n.t('MODULES.SETTINGS.TITLE')}
      isOpen={isOpen}
      onClose={onClose}
      modalStorageKey="wvt.settings"
      drawerWidth={576}
    >
      <ModalBodyViewLayout>
        <SettingsView />
      </ModalBodyViewLayout>
    </UnifiedPinnablePortal>
  );
};
