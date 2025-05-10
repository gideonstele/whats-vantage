import { createIntegratedUi, defineContentScript, injectScript, IntegratedContentScriptUi } from '#imports';

import { WHATS_APP_WEB_URL_PATTERN } from '@configs/consts';
import { mountApp } from '@content-scripts';
import { mountAppHeaderDom } from '@content-scripts/dom/external';
import { initDailyUsedListener } from '@content-scripts/external-stores/daily-used';
import { initReadyStateListener } from '@content-scripts/external-stores/ready-state';
import { initWppContentScriptsMessager } from '@content-scripts/messager';

import { HostDomObserver } from '@/content-scripts/host-dom-observer';

export default defineContentScript({
  matches: [WHATS_APP_WEB_URL_PATTERN],
  runAt: 'document_end',
  async main(ctx) {
    await injectScript('/wppconnect__wa.js', {
      keepInDom: true,
    });

    await injectScript('/inject.js', {
      keepInDom: true,
    });

    const observer = new HostDomObserver();

    const createUi = () => {
      return createIntegratedUi(ctx, {
        position: 'inline',
        anchor: 'body',
        append: 'last',
        onMount(uiContainer) {
          return mountApp(uiContainer);
        },
        onRemove(mounted) {
          mounted?.();
        },
      });
    };

    let ui: IntegratedContentScriptUi<() => void>;

    observer.addListener('ui:ready', (element) => {
      console.log('on ui:ready', element);

      mountAppHeaderDom(element);

      if (ui) {
        ui.remove();
        ui = createUi();
      } else {
        ui = createUi();
      }

      ui.mount();
    });

    observer.addListener('ui:unready', () => {
      console.log('on ui:unready');
      ui?.remove();
    });

    observer.start();

    ui = createUi();

    ui.mount();

    initReadyStateListener();

    initWppContentScriptsMessager();

    initDailyUsedListener();
  },
});
