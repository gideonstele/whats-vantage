import { onMessageToBackground } from '@services/background-messager';
import { MessageTemplateService } from '@services/db/message-templates';

export const initMessageTemplatesDbService = () => {
  const messageTemplatesService = MessageTemplateService.mount();

  onMessageToBackground('db:message-templates:list', async () => {
    return await messageTemplatesService.listTemplates();
  });

  onMessageToBackground('db:message-templates:item', async ({ data: payload }) => {
    return await messageTemplatesService.getTemplate(payload);
  });

  onMessageToBackground('db:message-templates:add', async ({ data: payload }) => {
    return await messageTemplatesService.addTemplate(payload);
  });

  onMessageToBackground('db:message-templates:update', async ({ data: payload }) => {
    return await messageTemplatesService.updateTemplate(payload.id, payload.item);
  });

  onMessageToBackground('db:message-templates:delete', async ({ data: payload }) => {
    return await messageTemplatesService.deleteTemplate(payload);
  });
};
