export const checkValidUrl = (url: string | URL) => {
  try {
    new URL(url.toString());
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return false;
  }
};

const fixInvalidUrl = (url: string) => {
  if (checkValidUrl(url)) {
    return url;
  }

  if (url.startsWith('//')) {
    return `https:${url}`;
  }

  return `https://${url}`;
};

export interface UrlEqualOptions {
  httpsAndHttpEqual?: boolean;
  ignoreWWW?: boolean;
  ignoreSearch?: boolean;
}

const isValidUrlEqual = (url1: string, url2: string, options: UrlEqualOptions) => {
  const urlobj1 = new URL(url1);
  const urlobj2 = new URL(url2);

  if (options.httpsAndHttpEqual) {
    urlobj1.protocol = urlobj1.protocol.replace('https', 'http');
    urlobj2.protocol = urlobj2.protocol.replace('https', 'http');
  }

  if (options.ignoreWWW) {
    urlobj1.hostname = urlobj1.hostname.replace(/^www\./, '');
    urlobj2.hostname = urlobj2.hostname.replace(/^www\./, '');
  }

  const isProtocolEqual = urlobj1.protocol === urlobj2.protocol;
  const isHostEqual = urlobj1.hostname === urlobj2.hostname;
  const isPathEqual = urlobj1.pathname === urlobj2.pathname;

  const isSearchEqual = options.ignoreSearch ? true : urlobj1.search === urlobj2.search;

  return isProtocolEqual && isHostEqual && isPathEqual && isSearchEqual;
};

/**
 * @description 比较两个url是否相同，忽略 search 和 hash
 * @param url1
 * @param url2
 * @param options https和http视为相同
 * @returns
 */
export const isUrlEqual = (url1: string, url2: string, options?: UrlEqualOptions) => {
  const mergedOptions: UrlEqualOptions = {
    httpsAndHttpEqual: options?.httpsAndHttpEqual ?? true,
    ignoreWWW: options?.ignoreWWW ?? true,
    ignoreSearch: options?.ignoreSearch ?? true,
  };

  if (checkValidUrl(url1) && checkValidUrl(url2)) {
    isValidUrlEqual(url1, url2, mergedOptions);
  }

  const fixedUrl1 = fixInvalidUrl(url1);
  const fixedUrl2 = fixInvalidUrl(url2);

  if (checkValidUrl(fixedUrl1) && checkValidUrl(fixedUrl2)) {
    return isValidUrlEqual(fixedUrl1, fixedUrl2, mergedOptions);
  }

  return url1 === url2;
};

export const fixUrlPattern = (pattern: string) => {
  let [, protocol, host, pathname] = /^([\*a-z]+\:\/\/)?([a-z0-9\-\*^\/]+)([^\?]+)?/i.exec(pattern) || [];
  if (!protocol) {
    protocol = '*://';
  }
  if (!host) {
    host = '*';
  }
  if (!pathname) {
    pathname = '';
  }
  return `${protocol}${host}${pathname}`;
};

/**
 * @description 返回精简的URL字符串
 *              1. 如果输入的字符串不是有效的URL，则返回原字符串
 *              2. 如果输入的字符串是有效的URL:
 *                2.1 如果URL的protocol是http或https，则省略
 *                2.2 如果URL以www开头，则省略
 *                2.3 如果URL有search或hash，则保留
 * @param url
 * @return {string}
 */
export const getSimpleUrl = (url: string) => {
  if (!checkValidUrl(url)) {
    return url;
  }

  const urlObj = new URL(url);

  const protocol = urlObj.protocol === 'http:' || urlObj.protocol === 'https:' ? '' : urlObj.protocol;
  const hostname = urlObj.hostname.startsWith('www.') ? urlObj.hostname.slice(4) : urlObj.hostname;
  const pathname = urlObj.pathname;
  const search = urlObj.search;
  const hash = urlObj.hash;

  return `${protocol}${hostname}${pathname}${search}${hash}`;
};

export const getUrlWithoutProtocol = (url: string) => {
  if (!checkValidUrl(url)) {
    return url;
  }

  const urlObj = new URL(url);
  return `${urlObj.hostname}${urlObj.pathname}${urlObj.search}${urlObj.hash}`;
};

export const getUrlEndWithSlash = (domain: string) => {
  if (!domain.endsWith('/')) {
    return `${domain}/`;
  }

  return domain;
};
