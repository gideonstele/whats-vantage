import { defineExtensionMessaging, ExtensionSendMessageArgs } from '@webext-core/messaging';

import { createSafeSendMessage } from '@utils/safe-message';
import {
  AddContactItem,
  ContactDbListParams,
  ContactDbListResult,
  DbFormattedContactItem,
  UpdateContactPayload,
} from 'types/db/contacts';
import { WppOptions } from 'types/options';

export interface BackgroundMessageProtocolMap {
  ['db:contacts:list']: (params?: ContactDbListParams) => Promise<ContactDbListResult>;
  ['db:contacts:item']: (params: string) => Promise<DbFormattedContactItem | undefined>;
  ['db:contacts:add']: (params: AddContactItem) => Promise<string>;
  ['db:contacts:bulk-add']: (params: AddContactItem[]) => Promise<string[]>;
  ['db:contacts:update']: (params: UpdateContactPayload) => Promise<number>;
  ['db:contacts:delete']: (params: string) => Promise<void>;
  ['db:contacts:bulk-delete']: (params: string[]) => Promise<void>;
  ['db:contacts:clear']: () => Promise<void>;

  ['settings:all:save'](settings: WppOptions): Promise<void>;
  ['settings:all:get'](): Promise<WppOptions>;
}

const { sendMessage, onMessage: onMessageToBackground } = defineExtensionMessaging<BackgroundMessageProtocolMap>();

const sendMessageToBackground = createSafeSendMessage<BackgroundMessageProtocolMap, ExtensionSendMessageArgs>(
  sendMessage,
);

export { onMessageToBackground, sendMessageToBackground };
