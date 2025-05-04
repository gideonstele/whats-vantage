import { enableLogger, getLogger } from './_';

export const wppLog = getLogger('WPP');

if (import.meta.env.WXT_DEBUG_WPP) {
  enableLogger(wppLog);
}
