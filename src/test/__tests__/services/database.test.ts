/**
 * Database Service Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { DatabaseService } from '@/src/services/appwrite/database';

// Mock Appwrite
vi.mock('@/src/services/appwrite/config', () => ({
  databases: {
    createDocument: vi.fn(),
    getDocument: vi.fn(),
    listDocuments: vi.fn(),
    updateDocument: vi.fn(),
    deleteDocument: vi.fn(),
  },
  storage: {
    createFile: vi.fn(),
    getFileView: vi.fn(),
  },
  APPWRITE_CONFIG: {
    databaseId: 'test-db',
    userCollectionId: 'test-users',
    imagesCollectionId: 'test-images',
    favoritesCollectionId: 'test-favorites',
    sharesCollectionId: 'test-shares',
    storageId: 'test-storage',
    avatarsStorageId: 'test-avatars',
  },
}));

describe('DatabaseService', () => {
  let databaseService: DatabaseService;

  beforeEach(() => {
    databaseService = new DatabaseService();
    vi.clearAllMocks();
  });

  describe('User Profile Management', () => {
    it('should create a user profile', async () => {
      const { databases } = await import('@/src/services/appwrite/config');
      vi.mocked(databases.createDocument).mockResolvedValue({} as any);

      await databaseService.createUserProfile('user-1', 'test@example.com', 'Test User');

      expect(databases.createDocument).toHaveBeenCalledWith(
        'test-db',
        'test-users',
        expect.any(String),
        expect.objectContaining({
          userId: 'user-1',
          email: 'test@example.com',
          name: 'Test User',
        })
      );
    });

    it('should get user profile by userId', async () => {
      const { databases } = await import('@/src/services/appwrite/config');
      vi.mocked(databases.listDocuments).mockResolvedValue({
        total: 1,
        documents: [{ $id: 'profile-1' }],
      } as any);

      const result = await databaseService.getUserProfile('user-1');

      expect(databases.listDocuments).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('Image Management', () => {
    it('should save generated image', async () => {
      const { databases } = await import('@/src/services/appwrite/config');
      vi.mocked(databases.createDocument).mockResolvedValue({} as any);
      vi.mocked(databases.listDocuments).mockResolvedValue({ 
        total: 1, 
        documents: [{}] 
      } as any);
      vi.mocked(databases.updateDocument).mockResolvedValue({} as any);

      const imageData = {
        userId: 'user-1',
        title: 'Test Image',
        description: 'Test description',
        prompt: 'A beautiful landscape',
        imageUrl: 'https://example.com/image.jpg',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        originalImageUrl: '',
        settings: { model: 'test', quality: 'standard', size: 'auto' },
        metadata: { fileSize: 1024, dimensions: { width: 512, height: 512 }, format: 'jpg' },
        isPublic: false,
        tags: ['landscape'],
        favoriteCount: 0,
        shareCount: 0,
      };

      await databaseService.saveGeneratedImage(imageData);

      expect(databases.createDocument).toHaveBeenCalled();
    });
  });
});