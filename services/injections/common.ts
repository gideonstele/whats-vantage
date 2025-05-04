import { onMessageToWppInjected, sendMessageToWppContentScripts } from '../injected-messager';

export const initCommon = (callback?: () => void) => {
  let hasSend = false;

  onMessageToWppInjected('injected:fetch-state:ready', () => {
    return !!window.WPP?.webpack?.isReady;
  });

  onMessageToWppInjected('injected:fetch-state:auth', () => {
    return !!window.WPP?.conn?.isAuthenticated;
  });

  const onReady = () => {
    console.log('webpack.onReady');

    if (!hasSend) {
      sendMessageToWppContentScripts('content-scripts:ready', undefined);
      hasSend = true;
    }
    window.WPP?.on('conn.authenticated', () => {
      console.log('conn.authenticated');
      sendMessageToWppContentScripts('content-scripts:update-auth', true);
    });

    window.WPP?.on('conn.logout', () => {
      console.log('conn.logout');
      sendMessageToWppContentScripts('content-scripts:update-auth', false);
    });

    window.WPP?.on('conn.main_ready', () => {
      console.log('conn.main_ready');
    });

    callback?.();
  };
  let timer: NodeJS.Timeout;
  const checkWaJsState = () => {
    try {
      console.log(window.WPP?.webpack?.onReady);

      if ('WPP' in window && 'webpack' in window.WPP && 'onReady' in window.WPP.webpack) {
        window.WPP.webpack.onReady(onReady, 3000);
        clearTimeout(timer);
      } else {
        timer = setTimeout(checkWaJsState, 1000);
      }
    } catch (e) {
      console.log('checkWaJsState', e);
    }
  };

  checkWaJsState();
};
