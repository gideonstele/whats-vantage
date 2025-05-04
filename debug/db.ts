import { enableLogger, getLogger } from './_';

export const dbLogger = getLogger('DB');

if (import.meta.env.WXT_DEBUG_DB) {
  enableLogger(dbLogger);
}
