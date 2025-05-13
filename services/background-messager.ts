import { defineExtensionMessaging, ExtensionSendMessageArgs } from '@webext-core/messaging';

import { createSafeSendMessage } from '@utils/safe-message';
import { SearchByOptions } from 'types/common';
import {
  AddContactItem,
  ContactDbListParams,
  ContactDbListResult,
  DbFormattedContactItem,
  UpdateContactPayload,
} from 'types/db/contacts';
import { AddCustomVariablesItem, CustomVariablesItem, UpdateCustomVariablesItem } from 'types/db/custom-variables';
import { AddMessageTemplateItem, UpdateMessageTemplateItem } from 'types/db/message-templates';
import { AddSendLogItem, SendLogDbListResult, SendLogDbQuerySortBy, UpdateSendLogItem } from 'types/db/send-logs';
import { MessageTemplateItem } from 'types/domain/message-templates';
import { SendLogItem } from 'types/domain/send-logs';
import { WppOptions } from 'types/options';

export interface UpdateCustomVariablesItemPayload {
  id: number;
  item: UpdateCustomVariablesItem;
}

export interface UpdateMessageTemplateItemPayload {
  id: number;
  item: UpdateMessageTemplateItem;
}

export interface BackgroundMessageProtocolMap {
  ['db:contacts:list']: (params?: ContactDbListParams) => Promise<ContactDbListResult>;
  ['db:contacts:item']: (params: string) => Promise<DbFormattedContactItem | undefined>;
  ['db:contacts:add']: (params: AddContactItem) => Promise<string>;
  ['db:contacts:bulk-add']: (params: AddContactItem[]) => Promise<string[]>;
  ['db:contacts:update']: (params: UpdateContactPayload) => Promise<number>;
  ['db:contacts:delete']: (params: string) => Promise<void>;
  ['db:contacts:bulk-delete']: (params: string[]) => Promise<void>;
  ['db:contacts:clear']: () => Promise<void>;

  ['db:custom-variables:list']: () => Promise<CustomVariablesItem[]>;
  ['db:custom-variables:item']: (params: number) => Promise<CustomVariablesItem | undefined>;
  ['db:custom-variables:add']: (params: AddCustomVariablesItem) => Promise<number>;
  ['db:custom-variables:update']: (params: UpdateCustomVariablesItemPayload) => Promise<number>;
  ['db:custom-variables:delete']: (params: number) => Promise<void>;
  ['db:custom-variables:clear']: () => Promise<void>;

  ['db:message-templates:list']: () => Promise<MessageTemplateItem[]>;
  ['db:message-templates:item']: (params: number) => Promise<MessageTemplateItem | undefined>;
  ['db:message-templates:add']: (params: AddMessageTemplateItem) => Promise<number>;
  ['db:message-templates:update']: (params: UpdateMessageTemplateItemPayload) => Promise<number>;
  ['db:message-templates:delete']: (params: number) => Promise<void>;

  ['db:send-logs:list']: (params?: {
    offset?: number;
    limit?: number;
    orderBy?: SendLogDbQuerySortBy[];
    searchs?: SearchByOptions<SendLogItem>[];
  }) => Promise<SendLogDbListResult>;
  ['db:send-logs:item']: (params: number) => Promise<SendLogItem | undefined>;
  ['db:send-logs:add']: (params: AddSendLogItem) => Promise<number>;
  ['db:send-logs:update']: (params: { id: number; item: UpdateSendLogItem }) => Promise<number>;
  ['db:send-logs:delete']: (params: number) => Promise<void>;
  ['db:send-logs:bulk-delete']: (params: number[]) => Promise<void>;
  ['db:send-logs:clear']: () => Promise<void>;

  ['settings:all:save'](settings: WppOptions): Promise<void>;
  ['settings:all:get'](): Promise<WppOptions>;
}

const { sendMessage, onMessage: onMessageToBackground } = defineExtensionMessaging<BackgroundMessageProtocolMap>();

const sendMessageToBackground = createSafeSendMessage<BackgroundMessageProtocolMap, ExtensionSendMessageArgs>(
  sendMessage,
);

export { onMessageToBackground, sendMessageToBackground };
