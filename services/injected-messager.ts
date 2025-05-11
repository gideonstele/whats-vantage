import { defineCustomEventMessaging } from '@webext-core/messaging/page';

import { CommonResponseType } from 'types/common';
import { AddSendLogItem } from 'types/db/send-logs';
import { FormattedContact, ImportedGroupItem } from 'types/domain/contacts';
import { FormattedGroup, PushGroupsMessage } from 'types/domain/groups';
import {
  ProcessedGroupItem,
  ProcessingDetail,
  SendMessageItem,
  SendMessagePayload,
  SendMessageResponse,
  SendMessageState,
  ValidateAccountPayload,
  ValidateAccountResponse,
  ValidateAccountsPayload,
} from 'types/domain/send-message';

export interface WppInjectedMessage {
  ['injected:fetch-state:ready'](): boolean;
  ['injected:fetch-state:auth'](): boolean;

  ['injected:fetch-state:send-message-state'](): SendMessageState;

  ['injected:fetch-contacts'](): CommonResponseType<FormattedContact[]>;

  ['injected:create-chat'](id: string): CommonResponseType<string>;

  ['injected:validate-account'](id: ValidateAccountPayload): Promise<ValidateAccountResponse>;
  ['injected:validate-accounts'](ids: ValidateAccountsPayload): Promise<ValidateAccountResponse[]>;

  ['injected:send-message'](payload: SendMessagePayload): SendMessageResponse;

  ['injected:fetch-groups'](): CommonResponseType<FormattedGroup[]>;
  ['injected:fetch-group-members'](groupIds: string[]): CommonResponseType<FormattedContact[]>;

  ['injected:import-groups'](payloads: ImportedGroupItem[]): CommonResponseType<undefined>;

  ['injected:check-invite-link'](data: ImportedGroupItem[]): CommonResponseType<string[]>;
  ['injected:join-group'](data: ProcessedGroupItem[]): CommonResponseType<string[]>;
  ['injected:stop-send-message'](): void;
  ['injected:stop-join-group'](): void;
}

export interface WppContentScriptsMessage {
  ['content-scripts:ready'](): void;
  ['content-scripts:update-auth'](state: boolean): void;
  ['content-scripts:send-message:update-all'](detail: ProcessingDetail<SendMessageItem>): void;
  ['content-scripts:send-message:complete'](): void;
  ['content-scripts:send-message:add-statistics'](data: AddSendLogItem): void;
  ['content-scripts:send-message:scheduled'](data: { scheduledTime: string; contactCount: number }): void;

  ['content-scripts:check-invite-link:update'](detail: ProcessingDetail<ProcessedGroupItem>): void;
  ['content-scripts:check-invite-link:complete'](): void;

  ['content-scripts:process-join-group:update'](detail: ProcessingDetail<ProcessedGroupItem>): void;
  ['content-scripts:process-join-group:add-count'](payload: { count: number; isSuccess: boolean }): void;
  ['content-scripts:process-join-group:complete'](): void;

  ['content-scripts:contacts:push-contacts'](data: FormattedContact[]): void;
  ['content-scripts:groups:push-groups'](data: PushGroupsMessage): void;
}
/**
 * from content-scripts to injected script
 */
export const { onMessage: onMessageToWppInjected, sendMessage: sendMessageToWppInjected } =
  defineCustomEventMessaging<WppInjectedMessage>({
    namespace: 'wvt:injected-messager',
  });

/**
 * from injected script to content-scripts
 */
export const { onMessage: onMessageToWppContentScripts, sendMessage: sendMessageToWppContentScripts } =
  defineCustomEventMessaging<WppContentScriptsMessage>({
    namespace: 'wvt:content-scripts-messager',
  });

export type WppContentScriptsMessageSender = typeof sendMessageToWppContentScripts;
