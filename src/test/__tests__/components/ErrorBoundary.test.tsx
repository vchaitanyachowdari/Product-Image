import { describe, it, expect, vi } from 'vitest';

import { ErrorBoundary } from '@/src/components/common';

import { render, screen } from '../../utils';

// Mock config to prevent environment validation errors
vi.mock('@/src/config', () => ({
  APP_CONFIG: {
    name: 'Test App',
    version: '1.0.0',
  },
  API_CONFIG: {
    baseUrl: 'http://localhost:3000',
  },
  env: {
    APPWRITE_ENDPOINT: 'https://test.appwrite.io/v1',
    APPWRITE_PROJECT_ID: 'test-project-id',
    APPWRITE_DATABASE_ID: 'test-database-id',
    APPWRITE_USERS_COLLECTION_ID: 'test-users-collection',
    APPWRITE_IMAGES_COLLECTION_ID: 'test-images-collection',
    APPWRITE_FAVORITES_COLLECTION_ID: 'test-favorites-collection',
    APPWRITE_SHARES_COLLECTION_ID: 'test-shares-collection',
    APPWRITE_ANALYTICS_COLLECTION_ID: 'test-analytics-collection',
    APPWRITE_STORAGE_BUCKET_ID: 'test-storage-bucket',
  },
  ERROR_MESSAGES: {
    generic: 'Something went wrong',
    network: 'Network error',
    validation: 'Validation error',
  },
}));

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders error UI when there is an error', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getAllByText('Something went wrong')).toHaveLength(2); // Title and description
    expect(screen.getByText('Reload Page')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('renders custom fallback when provided', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const customFallback = <div>Custom error message</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});