import { describe, it, expect, vi } from 'vitest';

import App from '@/src/app/App';

import { render, screen } from '../utils';

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

// Mock the auth hook to return unauthenticated state
vi.mock('@/src/hooks/useAppwriteAuth', () => ({
  useAppwriteAuth: () => ({
    user: null,
    isAuthenticated: false,
    logout: vi.fn(),
  }),
}));

describe('App', () => {
  it('renders landing page for unauthenticated users', () => {
    render(<App />);
    
    expect(screen.getByText('Transform Your Products with')).toBeInTheDocument();
    expect(screen.getByText('AI-Powered Imagery')).toBeInTheDocument();
  });

  it('has proper navigation buttons', () => {
    render(<App />);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('shows call-to-action buttons', () => {
    render(<App />);
    
    expect(screen.getByText('Get Started Free')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });
});