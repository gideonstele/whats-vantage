export function isValidBrowserRuntime() {
  // It turns out that chrome.runtime.getManifest() returns undefined when the
  // runtime has been reloaded.
  // Note: If this detection method ever fails, try to send a message using
  // chrome.runtime.sendMessage. It will throw an error upon failure.
  return browser.runtime && !!browser.runtime.getManifest();
}
