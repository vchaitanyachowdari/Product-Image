/**
 * UserDashboard Component Tests
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { UserDashboard } from '@/src/components/dashboard/UserDashboard';

// Mock hooks and services
vi.mock('@/src/hooks/useAppwriteAuth', () => ({
  useAppwriteAuth: () => ({
    user: {
      $id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
    },
  }),
}));

vi.mock('@/src/services/appwrite/database', () => ({
  databaseService: {
    getUserProfile: vi.fn(),
    createUserProfile: vi.fn(),
    getUserImages: vi.fn(),
  },
}));

// Mock child components
vi.mock('@/src/components/profile/UserProfile', () => ({
  UserProfile: ({ profile, onProfileUpdate }: any) => (
    <div data-testid="user-profile">
      Profile for {profile.name}
      <button onClick={() => onProfileUpdate({ ...profile, name: 'Updated Name' })}>
        Update Profile
      </button>
    </div>
  ),
}));

vi.mock('@/src/components/gallery/ImageGallery', () => ({
  ImageGallery: ({ userId, showFavoritesOnly }: any) => (
    <div data-testid="image-gallery">
      Gallery for {userId} {showFavoritesOnly ? '(favorites)' : ''}
    </div>
  ),
}));

describe('UserDashboard', () => {
  const mockProfile = {
    $id: 'profile-1',
    $createdAt: '2024-01-01',
    $updatedAt: '2024-01-01',
    userId: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    preferences: {
      theme: 'system' as const,
      notifications: true,
      publicProfile: false,
    },
    stats: {
      imagesGenerated: 5,
      favoriteCount: 3,
      shareCount: 2,
    },
  };

  const mockImages = [
    {
      $id: 'image-1',
      $createdAt: '2024-01-01',
      $updatedAt: '2024-01-01',
      userId: 'user-1',
      title: 'Test Image 1',
      description: 'Test description',
      prompt: 'Test prompt',
      imageUrl: 'https://example.com/image1.jpg',
      thumbnailUrl: 'https://example.com/thumb1.jpg',
      originalImageUrl: 'https://example.com/original1.jpg',
      settings: { model: 'test', quality: 'standard', size: 'auto' },
      metadata: { fileSize: 1024, dimensions: { width: 512, height: 512 }, format: 'jpg' },
      isPublic: false,
      tags: ['test'],
      favoriteCount: 0,
      shareCount: 0,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dashboard with user data', async () => {
    const { databaseService } = await import('@/src/services/appwrite/database');
    vi.mocked(databaseService.getUserProfile).mockResolvedValue(mockProfile);
    vi.mocked(databaseService.getUserImages).mockResolvedValue(mockImages);

    render(<UserDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Welcome back, Test User!')).toBeInTheDocument();
    });
  });

  it('creates user profile if not exists', async () => {
    const { databaseService } = await import('@/src/services/appwrite/database');
    vi.mocked(databaseService.getUserProfile).mockResolvedValue(null);
    vi.mocked(databaseService.createUserProfile).mockResolvedValue(mockProfile);
    vi.mocked(databaseService.getUserImages).mockResolvedValue(mockImages);

    render(<UserDashboard />);

    await waitFor(() => {
      expect(databaseService.createUserProfile).toHaveBeenCalledWith(
        'user-1',
        'test@example.com',
        'Test User'
      );
    });
  });

  it('displays stats correctly', async () => {
    const { databaseService } = await import('@/src/services/appwrite/database');
    vi.mocked(databaseService.getUserProfile).mockResolvedValue(mockProfile);
    vi.mocked(databaseService.getUserImages).mockResolvedValue(mockImages);

    render(<UserDashboard />);

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument(); // Images generated
      expect(screen.getByText('3')).toBeInTheDocument(); // Favorites
      expect(screen.getByText('2')).toBeInTheDocument(); // Shares
    });
  });

  it('switches between tabs', async () => {
    const { databaseService } = await import('@/src/services/appwrite/database');
    vi.mocked(databaseService.getUserProfile).mockResolvedValue(mockProfile);
    vi.mocked(databaseService.getUserImages).mockResolvedValue(mockImages);

    const user = userEvent.setup();
    render(<UserDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    // Switch to gallery tab
    await user.click(screen.getByText('My Images'));
    expect(screen.getByTestId('image-gallery')).toBeInTheDocument();
    expect(screen.getByText('Gallery for user-1')).toBeInTheDocument();

    // Switch to favorites tab
    await user.click(screen.getByText('Favorites'));
    expect(screen.getByText('Gallery for  (favorites)')).toBeInTheDocument();

    // Switch to profile tab
    await user.click(screen.getByText('Profile'));
    expect(screen.getByTestId('user-profile')).toBeInTheDocument();
  });

  it('handles profile updates', async () => {
    const { databaseService } = await import('@/src/services/appwrite/database');
    vi.mocked(databaseService.getUserProfile).mockResolvedValue(mockProfile);
    vi.mocked(databaseService.getUserImages).mockResolvedValue(mockImages);

    const user = userEvent.setup();
    render(<UserDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    // Switch to profile tab
    await user.click(screen.getByText('Profile'));
    
    // Update profile
    await user.click(screen.getByText('Update Profile'));

    // The profile should be updated (this would be reflected in the component state)
    expect(screen.getByTestId('user-profile')).toBeInTheDocument();
  });

  it('shows loading state', async () => {
    const { databaseService } = await import('@/src/services/appwrite/database');
    vi.mocked(databaseService.getUserProfile).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<UserDashboard />);

    expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner
  });

  it('handles error state when profile fails to load', async () => {
    const { databaseService } = await import('@/src/services/appwrite/database');
    vi.mocked(databaseService.getUserProfile).mockRejectedValue(new Error('Failed to load'));
    vi.mocked(databaseService.createUserProfile).mockRejectedValue(new Error('Failed to create'));
    vi.mocked(databaseService.getUserImages).mockResolvedValue([]);

    render(<UserDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load user profile')).toBeInTheDocument();
    });
  });
});