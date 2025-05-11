import Dexie, { Entity, EntityTable } from 'dexie';

import { AddMessageTemplateItem, UpdateMessageTemplateItem } from 'types/db/message-templates';
import { MessageTemplateItem } from 'types/domain/message-templates';

const messageTemplatesTableName = 'messageTemplates' as const;
const messageTemplatesTableColumnLiteral = '++id,title,content';

class MessageTemplateModel extends Entity<MessageTemplateService> implements MessageTemplateItem {
  id!: number;
  title!: string;
  content!: string;
}

export class MessageTemplateService extends Dexie {
  private static instance?: MessageTemplateService;

  static mount() {
    if (!MessageTemplateService.instance) {
      MessageTemplateService.instance = new MessageTemplateService();
    }

    return MessageTemplateService.instance;
  }

  static unmount() {
    if (MessageTemplateService.instance) {
      MessageTemplateService.instance.close();
      delete MessageTemplateService.instance;
    }
  }

  messageTemplates!: EntityTable<MessageTemplateModel, 'id'>;

  constructor() {
    super(messageTemplatesTableName);

    this.version(1).stores({
      [messageTemplatesTableName]: messageTemplatesTableColumnLiteral,
    });

    this.messageTemplates.mapToClass(MessageTemplateModel);
  }

  async addTemplate(item: AddMessageTemplateItem) {
    return await this.messageTemplates.add(item);
  }

  async listTemplates() {
    return this.messageTemplates.toArray();
  }

  async getTemplate(id: number) {
    return this.messageTemplates.get(id);
  }

  async updateTemplate(id: number, item: UpdateMessageTemplateItem) {
    return this.messageTemplates.update(id, item);
  }

  async deleteTemplate(id: number) {
    return this.messageTemplates.delete(id);
  }
}
