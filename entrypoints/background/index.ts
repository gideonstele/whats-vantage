import { browser, defineBackground } from '#imports';

import { onMessageToBackground } from '@services/background-messager';
import { getAllSettings, saveAllSettings } from '@services/storage/settings';

import { initContactsDbService } from './contacts-db';
import { initCustomVariablesDbService } from './custom-variables-db';
import { initMessageTemplatesDbService } from './message-templates-db';
import { initSendLogsDbService } from './send-logs-db';

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  initContactsDbService();
  initCustomVariablesDbService();
  initMessageTemplatesDbService();
  initSendLogsDbService();

  onMessageToBackground('settings:all:save', async ({ data: payload }) => {
    return await saveAllSettings(payload);
  });

  onMessageToBackground('settings:all:get', async () => {
    const allSettings = await getAllSettings();
    return allSettings;
  });
});
