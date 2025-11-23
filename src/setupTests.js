import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Provide a deterministic localStorage mock for components/contexts
const storage = (() => {
  let store = {};
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: storage,
  configurable: true
});

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
