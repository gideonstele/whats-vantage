import { getUrlEndWithSlash } from './url';

export const openOrSwitchToTab = async (url: string, queryUrl?: string) => {
  if (!('tabs' in browser)) {
    console.warn('browser.tabs is not supported');
    return;
  }

  const query = queryUrl ?? `${getUrlEndWithSlash(url)}/*`;

  const tabs = await browser.tabs.query({ url: query });

  if (tabs.length > 0) {
    await browser.tabs.update(tabs[0].id!, { active: true });
  } else {
    await browser.tabs.create({ url });
  }
};
