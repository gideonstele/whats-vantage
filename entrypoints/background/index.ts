import { browser, defineBackground } from '#imports';

import { initContactsDbService } from './contacts-db';

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  initContactsDbService();
});
