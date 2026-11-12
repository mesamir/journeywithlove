/* Safe localStorage wrapper. Fails silently if storage is unavailable. */
window.AFHStorage = (function () {
  'use strict';
  const KEYS = {
    contact:   'afh_contact_messages',
    admission: 'afh_admission_inquiries',
    tour:      'afh_tour_requests',
    cookie:    'afh_cookie_preferences'
  };

  function available() {
    try {
      const k = '__afh_test__';
      localStorage.setItem(k, '1');
      localStorage.removeItem(k);
      return true;
    } catch (e) { return false; }
  }
  function read(key) {
    if (!available()) return [];
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch (e) { return []; }
  }
  function write(key, value) {
    if (!available()) return false;
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  }
  function push(key, item) {
    const list = read(key);
    list.push(item);
    return write(key, list);
  }
  function remove(key, id) {
    return write(key, read(key).filter(x => x.id !== id));
  }
  function clear(key) { return write(key, []); }

  return { KEYS, available, read, write, push, remove, clear };
})();