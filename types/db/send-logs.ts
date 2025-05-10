import { MessageLogItem } from 'types/domain/send-logs';

export type AddMessageLogItem = Omit<MessageLogItem, 'id' | 'createdAt'>;
