import { defineUnlistedScript } from '#imports';

import { initCreateChat } from '@services/injections/create-chat';
import { initValidation } from '@services/injections/validation';

import { initCommon } from '../services/injections/common';
import { initContacts } from '../services/injections/contacts';

export default defineUnlistedScript(async () => {
  initCommon(() => {
    initContacts();
    initValidation();
    initCreateChat();
  });
});
