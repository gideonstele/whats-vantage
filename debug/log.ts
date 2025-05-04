import { enableLogger, getLogger } from './_';

export const logger = getLogger('WVT');

if (import.meta.env.WXT_DEBUG_WVT) {
  enableLogger(logger);
}
