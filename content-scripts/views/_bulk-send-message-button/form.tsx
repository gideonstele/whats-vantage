import { forwardRef, useImperativeHandle, useRef } from 'react';

import { useMemoizedFn } from 'ahooks';

import { useMessage } from '@hooks/use-message';
import { sendMessageToWppInjected } from '@services/injected-messager';
import { getDailyUsed } from '@services/storage/limit';
import { getAllSettings } from '@services/storage/settings';
import { FormattedContact } from 'types/domain/contacts';

import { ModalBodyViewLayout } from '../_/layout';
import { SendMessageRef, SendMessageView } from '../_send-message';

interface BulkSendMessageFormProps {
  contacts: FormattedContact[];
}

export interface BulkSendMessageFormRef {
  submit: () => Promise<void>;
}

export const BulkSendMessageForm = forwardRef<BulkSendMessageFormRef, BulkSendMessageFormProps>(({ contacts }, ref) => {
  const messageApi = useMessage();
  const sendMessagesFormRef = useRef<SendMessageRef>(null);

  const handleSendMessage = useMemoizedFn(async () => {
    const formValue = sendMessagesFormRef.current?.submit();

    if (formValue && contacts) {
      const settings = await getAllSettings();
      const used = await getDailyUsed();

      const result = await sendMessageToWppInjected('injected:send-message', {
        content: formValue.content,
        contacts,
        files: formValue.attachments,
        sendTimeType: formValue.sendTimeType,
        sendTime: formValue.sendTime?.format('HH:mm'),
        settings: {
          settings,
          used,
        },
      });

      if (result === 'processing') {
        messageApi.info('任务已创建');
      } else if (result === 'error') {
        messageApi.error('任务创建失败');
      }
    }
  });

  useImperativeHandle(ref, () => ({
    submit: handleSendMessage,
  }));

  return (
    <ModalBodyViewLayout>
      <SendMessageView ref={sendMessagesFormRef} />
    </ModalBodyViewLayout>
  );
});
