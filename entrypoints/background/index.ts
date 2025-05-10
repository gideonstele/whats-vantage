import { browser, defineBackground } from '#imports';

import { onMessageToBackground } from '@services/background-messager';
import { getAllSettings, saveAllSettings } from '@services/storage/settings';

import { initContactsDbService } from './contacts-db';

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  initContactsDbService();

  onMessageToBackground('settings:all:save', async ({ data: payload }) => {
    return await saveAllSettings(payload);
  });

  onMessageToBackground('settings:all:get', async () => {
    return await getAllSettings();
  });
});
