import { defineUnlistedScript } from '#imports';

import { initCreateChat } from '@services/injections/create-chat';
import { initSendMessage } from '@services/injections/send-message';
import { initValidation } from '@services/injections/validation';

import { initCommon } from '../services/injections/common';
import { initContacts } from '../services/injections/contacts';

export default defineUnlistedScript(async () => {
  initCommon(() => {
    initContacts();
    initSendMessage();
    initValidation();
    initCreateChat();
  });
});
