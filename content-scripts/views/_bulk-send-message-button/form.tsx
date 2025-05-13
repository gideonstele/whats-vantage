import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

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
  onPendingStateChange?: (isPending: boolean) => void;
  onEnableSubmitStateChange?: (isEnable: boolean) => void;
}

export interface BulkSendMessageFormRef {
  submit: () => Promise<boolean>;
}

export const BulkSendMessageForm = forwardRef<BulkSendMessageFormRef, BulkSendMessageFormProps>(
  ({ contacts, onPendingStateChange, onEnableSubmitStateChange }, ref) => {
    const messageApi = useMessage();
    const sendMessagesFormRef = useRef<SendMessageRef>(null);

    const handleSendMessage = useMemoizedFn(async () => {
      const formValue = sendMessagesFormRef.current?.submit();

      if (formValue && contacts) {
        const settings = await getAllSettings();
        const used = await getDailyUsed();

        onPendingStateChange?.(true);

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

        onPendingStateChange?.(false);

        if (result.type === 'processing' || result.type === 'scheduled') {
          messageApi.info('任务已创建');
          return true;
        } else if (result.type === 'error') {
          messageApi.error(result.message || '任务创建失败');
          return false;
        }
        return true;
      } else {
        messageApi.error('任务创建失败');
        return false;
      }
    });

    useImperativeHandle(ref, () => ({
      submit: handleSendMessage,
    }));

    return (
      <ModalBodyViewLayout>
        <SendMessageView
          ref={sendMessagesFormRef}
          onEnableSubmitStateChange={onEnableSubmitStateChange}
        />
      </ModalBodyViewLayout>
    );
  },
);
