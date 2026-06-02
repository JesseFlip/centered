import '@testing-library/jest-dom';

// Mock IndexedDB for testing
global.indexedDB = {
  open: () => ({
    result: {},
    onsuccess: null,
    onerror: null,
  }),
} as any;

// Mock crypto.randomUUID
if (!global.crypto) {
  global.crypto = {} as any;
}
if (!global.crypto.randomUUID) {
  global.crypto.randomUUID = (() => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }) as `${string}-${string}-${string}-${string}-${string}`;
  }) as typeof crypto.randomUUID;
}
