import { Browser, browser } from '#imports';

import { BROWSER_PROTOCOL_REG } from '@configs/consts';

export const queryTabsByMultipleUrls = async (urls: string | string[], callback: (tab: Browser.tabs.Tab) => void) => {
  const tabs = await browser.tabs.query({
    url: urls,
  });
  for (const tab of tabs) {
    try {
      await callback(tab);
    } catch (e) {
      console.error('[sw:utils:tabs-query] callback throw an error', e);
    }
  }
};

type RunAt = 'document_start' | 'document_end' | 'document_idle';

export interface InjectedInfo {
  tab?: Browser.tabs.Tab;
  allFrames?: boolean;
  runAt?: RunAt;
  js?: string[];
  css?: string[];
}

export type InjectedInfoFn = (info: InjectedInfo) => void;

export const queryTabsWithContentAndInjectedScripts = async (callback: InjectedInfoFn) => {
  const contentScripts = browser.runtime.getManifest().content_scripts;

  if (!contentScripts) {
    return;
  }

  for (const cs of contentScripts) {
    for (const tab of await browser.tabs.query({ url: cs.matches })) {
      if (!tab || !tab.url || !tab.id || tab.url.match(BROWSER_PROTOCOL_REG)) {
        continue;
      }

      const info: InjectedInfo = {
        tab,
        allFrames: cs.all_frames,
        runAt: cs.run_at as RunAt,
        js: cs.js,
        css: cs.css,
      };

      await callback(info);
    }
  }
};
