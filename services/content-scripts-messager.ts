import { defineExtensionMessaging } from '@webext-core/messaging';

import { createSafeToTabsSendMessage } from '@utils/safe-message';

export interface ContentScriptsMessageProtocolMap {
  ['from-background:settings:daily-max-send-count:change'](value: number): void;
  ['from-background:settings:daily-max-join-group-count:change'](value: number): void;
  ['from-background:settings:attachment-max-size:change'](value: number): void;
  ['from-background:settings:attachment-per-time-limit:change'](value: number): void;
  ['from-background:settings:send-message-interval:change'](value: [number, number]): void;
}

const { sendMessage, onMessage: onMessageFromBackgroundToContentScripts } =
  defineExtensionMessaging<ContentScriptsMessageProtocolMap>();

export const sendMessageFromBackgroundToContentScripts = createSafeToTabsSendMessage<ContentScriptsMessageProtocolMap>(
  sendMessage,
  ['https://web.whatsapp.com/*'],
);

export { onMessageFromBackgroundToContentScripts };
