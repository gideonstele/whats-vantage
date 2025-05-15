import { useState } from 'react';

import { UnifiedPinnablePortal } from '../../../components/unified-pinnable-portal';
import { ClosableModalDefaultProps } from '../../../contexts/modal-controller-context';
import { ModalBodyViewLayout } from '../../../views/_/layout';
import { SendLogView } from '../../../views/send-logs-root/send-logs';

export const SendLogsModal = ({ isOpen, onClose }: ClosableModalDefaultProps) => {
  const [parentView, setParentView] = useState<HTMLElement | null>(null);

  return (
    <UnifiedPinnablePortal
      integrated={false}
      title="发送日志"
      isOpen={isOpen}
      onClose={onClose}
      modalStorageKey="wvt.send-logs"
      drawerWidth={750}
    >
      <ModalBodyViewLayout ref={setParentView}>
        <SendLogView parentView={parentView} />
      </ModalBodyViewLayout>
    </UnifiedPinnablePortal>
  );
};
