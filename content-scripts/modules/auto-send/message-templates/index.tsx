import { i18n } from '#i18n';

import { UnifiedPinnablePortal } from '../../../components/unified-pinnable-portal';
import { ClosableModalDefaultProps } from '../../../contexts/modal-controller-context';
import { ModalBodyViewLayout } from '../../../views/_/layout';
import { MessageTemplatesView } from '../../../views/message-templates';

export const MessageTemplatesModal = ({ isOpen, onClose }: ClosableModalDefaultProps) => {
  return (
    <UnifiedPinnablePortal
      integrated={false}
      title={i18n.t('MODULES.AUTO_SEND.MESSAGE_TEMPLATES.TITLE')}
      modalStorageKey="sw-assistant.wpp.modal.auto-send.message-templates"
      drawerWidth={720}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalBodyViewLayout>
        <MessageTemplatesView />
      </ModalBodyViewLayout>
    </UnifiedPinnablePortal>
  );
};
