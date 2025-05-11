import { i18n } from '#i18n';

import { useRef, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import { Button, Modal, Skeleton } from 'antd';

import { FormattedContact } from 'types/domain/contacts';

import { BulkSendMessageForm, BulkSendMessageFormRef } from './form';

interface BulkSendMessageButtonProps {
  contacts: FormattedContact[];
}

export const BulkSendMessageButton = ({ contacts }: BulkSendMessageButtonProps) => {
  const bulkSendMessageFormRef = useRef<BulkSendMessageFormRef>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSendMessages = useMemoizedFn(async () => {
    const result = await bulkSendMessageFormRef.current?.submit();
    if (result) {
      setIsOpen(false);
    }
  });

  return (
    <>
      <Button
        variant="filled"
        color="primary"
        disabled={contacts?.length === 0}
        onClick={() => setIsOpen(true)}
      >
        {i18n.t('MODULES.MESSAGES.BULK_SEND')}
      </Button>
      <Modal
        title={i18n.t('MODULES.MESSAGES.BULK_SEND')}
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        onOk={handleSendMessages}
        okText={i18n.t('ACTIONS.SEND')}
        cancelText={i18n.t('ACTIONS.CANCEL')}
        okButtonProps={{ loading: isPending }}
      >
        {isPending ? (
          <Skeleton active />
        ) : (
          <BulkSendMessageForm
            ref={bulkSendMessageFormRef}
            contacts={contacts}
            onPendingStateChange={setIsPending}
          />
        )}
      </Modal>
    </>
  );
};
