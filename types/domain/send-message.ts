import { FormattedContact, ImportedGroupItem } from './contacts';
import { DailySettings, DailyUsed } from './settings';

export type SendMessageResponse = 'success' | 'error' | 'processing' | 'scheduled';

export enum SendMessageState {
  IDLE = 'idle',
  PROCESSING = 'processing',
}
export interface ValidateAccountPayloadObject {
  phoneNumber: string;
  name: string;
  ignoreValidate?: boolean;
}

export interface ProcessedAccountInfo extends ValidateAccountPayloadObject {
  id: string;
}

export type ValidateAccountPayload = string | ValidateAccountPayloadObject;

export type ValidateAccountsPayload = string[] | ValidateAccountPayloadObject[];

export interface SendMessageServiceSettings {
  /**
   * TODO
   */
  settings: DailySettings;
  used: DailyUsed;
}

export interface SendMessagePayload {
  contacts: FormattedContact[];
  content: string;
  files: Blob[];
  settings: SendMessageServiceSettings;
  sendTimeType?: 'immediately' | 'schedule';
  sendTime?: string;
}

export interface ValidateAccountResponse extends FormattedContact {
  exists: boolean;
  error?: boolean;
  message?: string;
}

export type ProcessStatus = 'pending' | 'processing' | 'success' | 'failed';

export type ProcessGroupStatus = 'can_join' | 'joined' | ProcessStatus;

export interface BaseProcessItem {
  id: string;
  errorReason?: string;
  tried?: boolean;
}

export interface SendMessageItem extends BaseProcessItem {
  status: ProcessStatus;
  contact: FormattedContact;
  message: string;
  attachmentCount?: number;
}

export interface ProcessingDetail<T extends BaseProcessItem> {
  isPending: boolean;
  remaining: T[];
  current: T | null;
  success: T[];
  error: T[];
}
export interface ProcessedGroupItem extends Omit<ImportedGroupItem, 'id'>, Omit<BaseProcessItem, 'status'> {
  status: ProcessGroupStatus;
  inviteLink: string;
  name?: string;
  site?: string;
  description?: string;
  dataSource?: string;
}
