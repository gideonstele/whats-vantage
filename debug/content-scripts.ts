import { enableLogger, getLogger } from './_.ts';

export const logContentScripts = getLogger('content-scripts');

if (import.meta.env.DEV) {
  enableLogger(logContentScripts, 'debug');
}
