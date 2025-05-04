import { onMessageToBackground } from '@services/background-message';
import { ContactService } from '@services/db';

export const initContactsDbService = () => {
  const contactService = ContactService.mount();

  onMessageToBackground('db:contacts:list', async ({ data: payload }) => {
    if (!payload) {
      return await contactService.getAllContacts();
    }

    const { offset, limit, orderBy, searchs } = payload;

    return await contactService.getContacts(offset, limit, orderBy, searchs);
  });

  onMessageToBackground('db:contacts:add', async ({ data: payload }) => {
    return await contactService.addContact(payload);
  });

  onMessageToBackground('db:contacts:bulk-add', async ({ data: payload }) => {
    console.info('db:contacts:bulk-add', payload);

    return await contactService.addContacts(payload);
  });

  onMessageToBackground('db:contacts:item', async ({ data: payload }) => {
    return await contactService.getContact(payload);
  });

  onMessageToBackground('db:contacts:update', async ({ data: payload }) => {
    return await contactService.updateContact(payload.id, payload.item);
  });

  onMessageToBackground('db:contacts:delete', async ({ data: payload }) => {
    return await contactService.deleteContact(payload);
  });

  onMessageToBackground('db:contacts:bulk-delete', async ({ data: payload }) => {
    return await contactService.bulkDeleteContacts(payload);
  });

  onMessageToBackground('db:contacts:clear', async () => {
    return await contactService.clearContacts();
  });
};
