import { logContentScripts as debugConsole } from '@debug';

import { WHATS_APP_WEB_URL_PATTERN } from '@configs/consts';
import { mountApp } from '@content-scripts';
import { mountAppHeaderDom } from '@content-scripts/dom/external';

import { HostDomObserver } from '@/content-scripts/host-dom-observer';

export default defineContentScript({
  matches: [WHATS_APP_WEB_URL_PATTERN],
  runAt: 'document_end',
  async main(ctx) {
    injectScript('/wppconnect__wa.js', {
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
      debugConsole.log('on ui:ready', element);

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
      debugConsole.log('on ui:unready');
      ui?.remove();
    });

    observer.start();

    ui = createUi();

    ui.mount();
  },
});
