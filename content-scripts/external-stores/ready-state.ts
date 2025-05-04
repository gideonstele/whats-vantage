import { createExternalState } from '@hooks/create-external-store';
import { onMessageToWppContentScripts, sendMessageToWppInjected } from '@services/injected-messager';

export const [wppAuth, useWppAuth] = createExternalState(false, async () => {
  return await sendMessageToWppInjected('injected:fetch-state:auth', undefined);
});

export const [wppMainReady, useWppMainReady] = createExternalState(false, async () => {
  return await sendMessageToWppInjected('injected:fetch-state:ready', undefined);
});

export const initReadyStateListener = () => {
  const unwatches = [
    onMessageToWppContentScripts('content-scripts:ready', () => {
      wppMainReady.update(true);
    }),

    onMessageToWppContentScripts('content-scripts:update-auth', ({ data: state }) => {
      wppAuth.update(state);
    }),
  ];

  const twoDomRefTimer = setInterval(() => {
    const twoDomRef = document.getElementById('sw-header-wrapper');

    if (twoDomRef) {
      wppAuth.update(true);
      clearInterval(twoDomRefTimer);
    }
  }, 1000);

  function unwatch() {
    unwatches.forEach((unwatch) => {
      unwatch();
    });
  }

  return unwatch;
};
