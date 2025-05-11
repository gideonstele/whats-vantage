import { FormattedContact } from './contacts';

export interface SendLogItem {
  id: number;
  contact: FormattedContact;
  message: string;
  createdAt: number;
  attachmentCount?: number;
  success?: boolean;
  reason?: string;
}
