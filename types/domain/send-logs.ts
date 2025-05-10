import { FormattedContact } from './contacts';

export interface MessageLogItem {
  id: number;
  contact: FormattedContact;
  message: string;
  createdAt: number;
  attachmentCount?: number;
  success?: boolean;
  reason?: string;
}
