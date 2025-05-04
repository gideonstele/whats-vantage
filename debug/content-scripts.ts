import { enableLogger, getLogger } from './_.ts';

export const logContentScripts = getLogger('content-scripts');

if (import.meta.env.WXT_DEBUG_CONTENT_SCRIPTS) {
  enableLogger(logContentScripts, 'debug');
}
