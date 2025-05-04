/* eslint-disable @typescript-eslint/no-explicit-any */
import { cloneDeep, isNil } from 'lodash-es';
import { PublicPath } from 'wxt/browser';

import { logCommon, logger } from '@debug';

import { GetDataType, GetReturnType } from '@webext-core/messaging';

import { queryPopupWindowCallback } from './open-window';
import { isValidBrowserRuntime } from './runtime-valid';
import { queryTabsByMultipleUrls } from './tabs-query';

/**
 * Send a message to the background or a specific tab if `tabId` is passed. You can call this
 * function anywhere in your extension.
 *
 * If you haven't setup a listener for the sent `type`, an error will be thrown.
 *
 * @param type The message type being sent. Call `onMessage` with the same type to listen for that message.
 * @param data The data to send with the message.
 * @param args Different messengers will have additional arguments to configure how a message gets sent.
 */
type SendMessage<TProtocolMap extends Record<string, any>, TSendMessageArgs extends any[]> = <
  TType extends keyof TProtocolMap,
>(
  type: TType,
  data: GetDataType<TProtocolMap[TType]>,
  ...args: TSendMessageArgs
) => Promise<GetReturnType<TProtocolMap[TType]>>;

export const createSafeSendMessage = <PMap extends Record<string, any>, TSendMessageArgs extends any[]>(
  sendMessage: SendMessage<PMap, TSendMessageArgs>,
) => {
  return async <TType extends keyof PMap>(
    type: TType,
    data: GetDataType<PMap[TType]>,
    fallbackResponse?: Awaited<GetReturnType<PMap[TType]>> | undefined,
    ...args: TSendMessageArgs
  ): Promise<GetReturnType<PMap[TType]> | undefined> => {
    const cloneResponse = typeof fallbackResponse === 'object' ? cloneDeep(fallbackResponse) : fallbackResponse;

    try {
      if (isValidBrowserRuntime()) {
        const response = await sendMessage(type, data, ...args);
        return isNil(response) ? cloneResponse : response;
      }
    } catch (e) {
      logger.warn('[safe-message] error, message type:', type, 'payload:', data, 'error:', e);
      return cloneResponse;
    }
  };
};

export const createSafeToPathSendMessage = <PMap extends Record<string, any>>(
  sendMessage: SendMessage<PMap, [tabId?: number]>,
  path: PublicPath,
) => {
  return async <TType extends keyof PMap>(
    type: TType,
    data: GetDataType<PMap[TType]>,
    fallbackResponse?: Awaited<GetReturnType<PMap[TType]>> | undefined,
  ): Promise<GetReturnType<PMap[TType]> | undefined> => {
    const cloneResponse = typeof fallbackResponse === 'object' ? cloneDeep(fallbackResponse) : fallbackResponse;

    try {
      if (isValidBrowserRuntime()) {
        const window = await queryPopupWindowCallback(path);

        if (window?.tabs?.[0]?.id) {
          const response = await sendMessage(type, data, window.tabs?.[0]?.id);
          return isNil(response) ? cloneResponse : response;
        }
      }
    } catch (e) {
      logger.warn('[safe-message:to-path]', type, 'payload:', data, 'error:', e, '\n', path);
      return cloneResponse;
    }
  };
};

export const createSafeToTabsSendMessage = <PMap extends Record<string, any>>(
  sendMessage: SendMessage<PMap, [tabId?: number]>,
  url: string | string[],
  tabFilter: (tab: Browser.tabs.Tab) => boolean = () => true,
) => {
  return async <TType extends keyof PMap>(
    type: TType,
    data: GetDataType<PMap[TType]>,
    fallbackResponse?: Awaited<GetReturnType<PMap[TType]>> | undefined,
  ): Promise<Record<string, Awaited<GetReturnType<PMap[TType]>> | undefined>> => {
    const returns: Record<string, Awaited<GetReturnType<PMap[TType]>> | undefined> = {};

    if (isValidBrowserRuntime()) {
      await queryTabsByMultipleUrls(url, async (tab) => {
        try {
          if (tab.id && tab.status === 'complete' && tabFilter(tab)) {
            const response = await sendMessage(type, data, tab.id);
            const cloneFallbackResponse =
              typeof fallbackResponse === 'object' ? cloneDeep(fallbackResponse) : fallbackResponse;
            returns[tab.id] = response || cloneFallbackResponse;
          }
        } catch (e) {
          logCommon.warn('[safe-message:to-tabs]', type, 'payload:', data, 'error:', e, tab.url);
        }
      });
    }

    return returns;
  };
};
