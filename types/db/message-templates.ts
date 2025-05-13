import { MessageTemplateItem } from '../domain/message-templates';

export type AddMessageTemplateItem = Omit<MessageTemplateItem, 'id'>;

export type PutMessageTemplateItem = AddMessageTemplateItem;

export type UpdateMessageTemplateItem = Partial<Omit<MessageTemplateItem, 'id'>>;
