import { browser, PublicPath } from 'wxt/browser';

import { openOrSwitchToTab } from './open-or-switch-to-tab';
import { isUrlEqual } from './url';

export const openOrSwitchToExtensionPage = async (path: PublicPath) => {
  const popupUrl = browser.runtime.getURL(path);
  await openOrSwitchToTab(popupUrl, popupUrl);
};

const queryPopupWindow = async (path: PublicPath, autoFocus = true) => {
  const popupUrl = browser.runtime.getURL(path);

  const wins = await browser.windows.getAll({
    windowTypes: ['popup'],
    populate: true,
  });

  for (const win of wins) {
    for (const tab of win.tabs!) {
      const tabUrl = tab.url!;
      if (isUrlEqual(tabUrl, popupUrl)) {
        if (autoFocus) {
          await browser.windows.update(win.id!, {
            focused: true,
          });
        }
        return win;
      }
    }
  }
};

export const openPopup = async (path: PublicPath) => {
  const createWindow = async () => {
    const win = await queryPopupWindow(path, true);

    if (win) {
      return win;
    }

    const newWin = await browser.windows.create({
      url: path,
      type: 'popup',
      // top: 0,
      // left: 0,
      width: 1366,
      height: 910,
    });
    newWin.alwaysOnTop = true;

    if (newWin.id) {
      await browser.windows.update(newWin.id, {
        focused: true,
      });
    }

    return newWin;
  };

  return createWindow();
};

export const closePopup = async (path: PublicPath) => {
  const win = await queryPopupWindow(path, false);

  if (win) {
    await browser.windows.remove(win.id!);
    return;
  }
};

export const queryPopupWindowCallback = async (path: PublicPath) => {
  const win = await queryPopupWindow(path, false);
  return win;
};
