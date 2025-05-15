import { sendMessageToBackground } from '@services/background-messager';
import { onMessageToWppContentScripts } from '@services/injected-messager';
import { DailyJoinGroupCount, DailySentCount } from '@services/storage/limit';

import { wppQueryClient } from './query/client';

export const initWppContentScriptsMessager = () => {
  onMessageToWppContentScripts('content-scripts:send-message:add-statistics', async ({ data }) => {
    await sendMessageToBackground('db:send-logs:add', data);

    await DailySentCount.add(1);

    wppQueryClient.invalidateQueries({ queryKey: ['background/db/send-logs/list'] });
  });

  onMessageToWppContentScripts('content-scripts:process-join-group:add-count', async ({ data }) => {
    await DailyJoinGroupCount.add(data.count);
  });

  onMessageToWppContentScripts('content-scripts:contacts:push-contacts', async ({ data }) => {
    await sendMessageToBackground('db:contacts:bulk-add', data);
    wppQueryClient.invalidateQueries({ queryKey: ['background/db/contacts/list'] });
  });
};
