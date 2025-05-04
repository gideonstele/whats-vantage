import { filterAvailableUserContacts, formatWithProfilePictureUrl } from '../helpers/contacts';
import { onMessageToWppInjected, sendMessageToWppContentScripts } from '../injected-messager';

export const initContacts = () => {
  const fetchContact = async () => {
    try {
      const contacts = await window.WPP.contact.list();
      const filteredContacts = filterAvailableUserContacts(contacts);
      const availableContacts = await formatWithProfilePictureUrl(filteredContacts);

      return contacts
        ? {
            success: true,
            data: availableContacts,
          }
        : {
            success: false,
            message: '获取联系人失败',
          };
    } catch (error) {
      console.error('获取联系人失败', error);

      return {
        success: false,
        message: '获取联系人失败',
      };
    }
  };

  const delayPushContacts = () => {
    setTimeout(async () => {
      const { success, data, message } = await fetchContact();

      if (success && data) {
        sendMessageToWppContentScripts('content-scripts:contacts:push-contacts', data);
      } else {
        console.error('主动获取联系人失败', message);
      }
    }, 1000);
  };

  onMessageToWppInjected('injected:fetch-contacts', async () => {
    return await fetchContact();
  });

  console.log('conn.authenticated, onready', window.WPP?.conn?.isAuthenticated());
  if (window.WPP?.conn?.isAuthenticated()) {
    console.log('conn.authenticated, contacts');
    delayPushContacts();
  } else {
    window.WPP?.on('conn.authenticated', () => {
      console.log('conn.authenticated, trigger');
      delayPushContacts();
    });
  }
};
