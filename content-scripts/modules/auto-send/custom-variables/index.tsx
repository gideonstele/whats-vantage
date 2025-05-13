import { i18n } from '#i18n';

import { CustomVariablesView } from '@content-scripts/views/custom-variables';

import { UnifiedPinnablePortal } from '../../../components/unified-pinnable-portal';
import { ClosableModalDefaultProps } from '../../../contexts/modal-controller-context';
import { ModalBodyViewLayout } from '../../../views/_/layout';

export const CustomVariablesModal = ({ isOpen, onClose }: ClosableModalDefaultProps) => {
  return (
    <UnifiedPinnablePortal
      title={i18n.t('MODULES.CUSTOM_VARIABLES.TITLE')}
      isOpen={isOpen}
      onClose={onClose}
      modalStorageKey="wvt.custom-variables"
      drawerWidth={576}
    >
      <ModalBodyViewLayout>
        <CustomVariablesView />
      </ModalBodyViewLayout>
    </UnifiedPinnablePortal>
  );
};
