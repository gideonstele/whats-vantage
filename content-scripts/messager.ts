import { sendMessageToBackground } from '@services/background-messager';
import { onMessageToWppContentScripts } from '@services/injected-messager';

import { wppQueryClient } from './query/client';

export const initWppContentScriptsMessager = () => {
  onMessageToWppContentScripts('content-scripts:contacts:push-contacts', async ({ data }) => {
    await sendMessageToBackground('db:contacts:bulk-add', data);
    wppQueryClient.invalidateQueries({ queryKey: ['background/db/contacts/list'] });
  });
};
