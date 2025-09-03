import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { expect, afterEach } from 'vitest';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock environment variables for tests
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_GEMINI_API_KEY: 'test-api-key',
    VITE_APP_NAME: 'Test App',
    VITE_APP_VERSION: '1.0.0',
    VITE_API_BASE_URL: 'http://localhost:3000',
    VITE_ENABLE_ANALYTICS: 'false',
    VITE_MAX_FILE_SIZE: '5242880',
    VITE_MAX_FILES_COUNT: '10',
    VITE_SUPPORTED_IMAGE_FORMATS: 'jpg,jpeg,png,webp',
    VITE_APPWRITE_ENDPOINT: 'https://test.appwrite.io/v1',
    VITE_APPWRITE_PROJECT_ID: 'test-project-id',
    VITE_APPWRITE_DATABASE_ID: 'test-database-id',
    VITE_APPWRITE_USERS_COLLECTION_ID: 'test-users-collection',
    VITE_APPWRITE_IMAGES_COLLECTION_ID: 'test-images-collection',
    VITE_APPWRITE_FAVORITES_COLLECTION_ID: 'test-favorites-collection',
    VITE_APPWRITE_SHARES_COLLECTION_ID: 'test-shares-collection',
    VITE_APPWRITE_ANALYTICS_COLLECTION_ID: 'test-analytics-collection',
    VITE_APPWRITE_STORAGE_BUCKET_ID: 'test-storage-bucket',
    MODE: 'test',
    PROD: false,
    DEV: false,
  },
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root = null;
  rootMargin = '';
  thresholds = [];
  
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() { return []; }
} as any; // eslint-disable-line @typescript-eslint/no-explicit-any

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});