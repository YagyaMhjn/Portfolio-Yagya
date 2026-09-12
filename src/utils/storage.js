/**
 * Lightweight IndexedDB persistent storage layer to supplement localStorage.
 * Overcomes localStorage's 5MB hard limit for rich media and portfolios.
 */
const DB_NAME = 'yagya_portfolio_db';
const STORE_NAME = 'portfolio_store';
const DB_VERSION = 1;

const openDB = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
};

export const idbSet = async (key, val) => {
  try {
    const db = await openDB();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(val, key);
  } catch (e) {
    console.warn('IndexedDB set failed', e);
  }
};

export const idbGet = async (key) => {
  try {
    const db = await openDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    console.warn('IndexedDB get failed', e);
    return null;
  }
};
