import { createExternalState } from '@hooks/create-external-store';
import { onMessageToWppContentScripts } from '@services/injected-messager';
import { ProcessingDetail, SendMessageItem } from 'types/domain/send-message';

export type SendMessageProcessingState = ProcessingDetail<SendMessageItem> & {
  scheduledTime?: string;
  contactCount?: number;
};

export const [sendMessageProcessingState, useSendMessageProcessingState] =
  createExternalState<SendMessageProcessingState>({
    isPending: false,
    remaining: [],
    current: null,
    success: [],
    error: [],
  });

export const initSendMessageProcessingListener = () => {
  onMessageToWppContentScripts('content-scripts:send-message:complete', () => {
    sendMessageProcessingState.update((prevState) => ({
      ...prevState,
      isPending: false,
      scheduledTime: undefined,
      contactCount: undefined,
    }));
  });

  onMessageToWppContentScripts('content-scripts:send-message:update-all', ({ data: detail }) => {
    sendMessageProcessingState.update({
      isPending: detail.isPending,
      remaining: detail.remaining || [],
      current: detail.current,
      success: detail.success || [],
      error: detail.error || [],
      scheduledTime: undefined,
      contactCount: undefined,
    });
  });

  onMessageToWppContentScripts('content-scripts:send-message:scheduled', ({ data }) => {
    sendMessageProcessingState.update({
      isPending: true,
      remaining: [],
      current: null,
      success: [],
      error: [],
      scheduledTime: data.scheduledTime,
      contactCount: data.contactCount,
    });
  });

  onMessageToWppContentScripts('content-scripts:send-message:immediate', ({ data }) => {
    sendMessageProcessingState.update({
      isPending: true,
      remaining: [],
      current: null,
      success: [],
      error: [],
      scheduledTime: undefined,
      contactCount: data.contactCount,
    });
  });
};
