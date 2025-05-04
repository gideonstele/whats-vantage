import debug from 'debug';

if (import.meta.env.WXT_DEBUG) {
  debug.enable('*');
} else {
  if (import.meta.env.WXT_DEBUG_CONTACTS) {
    debug.enable('contacts');
  }
  if (import.meta.env.WXT_DEBUG_CONTENT_SCRIPTS) {
    debug.enable('content-scripts');
  }
  if (import.meta.env.WXT_DEBUG_DB) {
    debug.enable('db');
  }
  if (import.meta.env.WXT_DEBUG_UI) {
    debug.enable('wpp');
  }
}

const consoles = {
  log: debug('*'),
  contacts: debug('contacts'),
  'content-scripts': debug('content-scripts'),
  db: debug('db'),
  wpp: debug('wpp'),
};

export { consoles };
