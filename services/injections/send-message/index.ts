import { SendMessageState } from 'types/domain/send-message';

import { onMessageToWppInjected, sendMessageToWppContentScripts } from '../../injected-messager';

import { SendMessageService } from './service';

export const initSendMessage = () => {
  const sendMessageService = SendMessageService.getInstance(sendMessageToWppContentScripts);

  onMessageToWppInjected('injected:send-message', async ({ data }) => {
    const delayTime = data.sendTimeType && data.sendTime ? data.sendTime : undefined;

    return await sendMessageService.start(data.content, data.files, data.contacts, data.settings, delayTime);
  });

  onMessageToWppInjected('injected:fetch-state:send-message-state', () => {
    return sendMessageService.isProcessing ? SendMessageState.PROCESSING : SendMessageState.IDLE;
  });

  onMessageToWppInjected('injected:stop-send-message', () => {
    sendMessageService.stop();
  });
};
