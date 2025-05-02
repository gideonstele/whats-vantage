import { enableLogger, getLogger } from './_.ts';

export const logCommon = getLogger('common');

if (import.meta.env.DEV) {
  enableLogger(logCommon, 'debug');
}
