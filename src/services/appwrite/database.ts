/**
 * Appwrite database service for managing collections
 */

import { ID, Query } from 'appwrite';

import type { 
  UserProfile, 
  GeneratedImage, 
  Favorite, 
  Share,
  SystemStats 
} from '@/types/database.types';

import { databases, storage, APPWRITE_CONFIG } from './config';

export class DatabaseService {
  // User Profile Management
  async createUserProfile(userId: string, email: string, name: string): Promise<UserProfile> {
    const result = await databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.userCollectionId,
      ID.unique(),
      {
        userId,
        email,
        name,
        preferences: {
          theme: 'system',
          notifications: true,
          publicProfile: false,
        },
        stats: {
          imagesGenerated: 0,
          favoriteCount: 0,
          shareCount: 0,
        },
      }
    );
    return result as unknown as UserProfile;
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.userCollectionId,
        [Query.equal('userId', userId)]
      );
      return (response.documents[0] as unknown as UserProfile) || null;
    } catch {
      return null;
    }
  }

  async updateUserProfile(profileId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const result = await databases.updateDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.userCollectionId,
      profileId,
      updates as any
    );
    return result as unknown as UserProfile;
  }

  async uploadAvatar(_userId: string, file: File): Promise<string> {
    const response = await storage.createFile(
      APPWRITE_CONFIG.avatarsStorageId,
      ID.unique(),
      file
    );
    
    const avatarUrl = storage.getFileView(
      APPWRITE_CONFIG.avatarsStorageId,
      response.$id
    );

    return avatarUrl.toString();
  }

  // Generated Images Management
  async saveGeneratedImage(imageData: Omit<GeneratedImage, '$id' | '$createdAt' | '$updatedAt'>): Promise<GeneratedImage> {
    const response = await databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.imagesCollectionId,
      ID.unique(),
      imageData
    );

    // Update user stats
    await this.incrementUserStat(imageData.userId, 'imagesGenerated');

    return response as unknown as GeneratedImage;
  }

  async getUserImages(userId: string, limit = 20, offset = 0): Promise<GeneratedImage[]> {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.imagesCollectionId,
      [
        Query.equal('userId', userId),
        Query.orderDesc('$createdAt'),
        Query.limit(limit),
        Query.offset(offset),
      ]
    );
    return response.documents as unknown as GeneratedImage[];
  }

  async getPublicImages(limit = 20, offset = 0): Promise<GeneratedImage[]> {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.imagesCollectionId,
      [
        Query.equal('isPublic', true),
        Query.orderDesc('$createdAt'),
        Query.limit(limit),
        Query.offset(offset),
      ]
    );
    return response.documents as unknown as GeneratedImage[];
  }

  async getImageById(imageId: string): Promise<GeneratedImage | null> {
    try {
      const response = await databases.getDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.imagesCollectionId,
        imageId
      );
      return response as unknown as GeneratedImage;
    } catch {
      return null;
    }
  }

  async updateImage(imageId: string, updates: Partial<GeneratedImage>): Promise<GeneratedImage> {
    const result = await databases.updateDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.imagesCollectionId,
      imageId,
      updates as any
    );
    return result as unknown as GeneratedImage;
  }

  async deleteImage(imageId: string, userId: string): Promise<void> {
    // Verify ownership
    const image = await this.getImageById(imageId);
    if (!image || image.userId !== userId) {
      throw new Error('Unauthorized or image not found');
    }

    await databases.deleteDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.imagesCollectionId,
      imageId
    );

    // Update user stats
    await this.decrementUserStat(userId, 'imagesGenerated');
  }

  // Favorites Management
  async addToFavorites(userId: string, imageId: string): Promise<Favorite> {
    const favorite = await databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.favoritesCollectionId,
      ID.unique(),
      { userId, imageId }
    );

    // Update counters
    await this.incrementImageCounter(imageId, 'favoriteCount');
    await this.incrementUserStat(userId, 'favoriteCount');

    return favorite as unknown as Favorite;
  }

  async removeFromFavorites(userId: string, imageId: string): Promise<void> {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.favoritesCollectionId,
      [
        Query.equal('userId', userId),
        Query.equal('imageId', imageId),
      ]
    );

    if (response.documents.length > 0) {
      await databases.deleteDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.favoritesCollectionId,
        response.documents[0]?.$id || ''
      );

      // Update counters
      await this.decrementImageCounter(imageId, 'favoriteCount');
      await this.decrementUserStat(userId, 'favoriteCount');
    }
  }

  async getUserFavorites(userId: string, limit = 20, offset = 0): Promise<GeneratedImage[]> {
    const favoritesResponse = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.favoritesCollectionId,
      [
        Query.equal('userId', userId),
        Query.orderDesc('$createdAt'),
        Query.limit(limit),
        Query.offset(offset),
      ]
    );

    const imageIds = favoritesResponse.documents.map(fav => (fav as any).imageId);
    if (imageIds.length === 0) return [];

    const imagesResponse = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.imagesCollectionId,
      [Query.equal('$id', imageIds)]
    );

    return imagesResponse.documents as unknown as GeneratedImage[];
  }

  async isFavorited(userId: string, imageId: string): Promise<boolean> {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.favoritesCollectionId,
      [
        Query.equal('userId', userId),
        Query.equal('imageId', imageId),
      ]
    );
    return response.documents.length > 0;
  }

  // Sharing Management
  async createShare(userId: string, imageId: string, expiresAt?: string): Promise<Share> {
    const shareUrl = `${window.location.origin}/shared/${ID.unique()}`;
    
    const share = await databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.sharesCollectionId,
      ID.unique(),
      {
        userId,
        imageId,
        shareUrl,
        expiresAt,
        viewCount: 0,
        isActive: true,
      }
    );

    // Update counters
    await this.incrementImageCounter(imageId, 'shareCount');
    await this.incrementUserStat(userId, 'shareCount');

    return share as unknown as Share;
  }

  async getShareByUrl(shareUrl: string): Promise<Share | null> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.sharesCollectionId,
        [Query.equal('shareUrl', shareUrl)]
      );
      return (response.documents[0] as unknown as Share) || null;
    } catch {
      return null;
    }
  }

  async incrementShareView(shareId: string): Promise<void> {
    const share = await databases.getDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.sharesCollectionId,
      shareId
    );

    await databases.updateDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.sharesCollectionId,
      shareId,
      { viewCount: (share as any).viewCount + 1 }
    );
  }

  // Search functionality
  async searchImages(query: string, limit = 20): Promise<GeneratedImage[]> {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.imagesCollectionId,
      [
        Query.or([
          Query.search('title', query),
          Query.search('description', query),
          Query.search('prompt', query),
          Query.search('tags', query),
        ]),
        Query.equal('isPublic', true),
        Query.limit(limit),
      ]
    );
    return response.documents as unknown as GeneratedImage[];
  }

  // Admin functions
  async getAllUsers(limit = 50, offset = 0): Promise<UserProfile[]> {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.userCollectionId,
      [
        Query.orderDesc('$createdAt'),
        Query.limit(limit),
        Query.offset(offset),
      ]
    );
    return response.documents as unknown as UserProfile[];
  }

  async getSystemStats(): Promise<SystemStats> {
    const [usersResponse, imagesResponse, sharesResponse] = await Promise.all([
      databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.userCollectionId, [Query.limit(1)]),
      databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.imagesCollectionId, [Query.limit(1)]),
      databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.sharesCollectionId, [Query.limit(1)]),
    ]);

    return {
      totalUsers: usersResponse.total,
      totalImages: imagesResponse.total,
      totalShares: sharesResponse.total,
      storageUsed: 0, // Would need to calculate from storage
      activeUsers: 0, // Would need to track active sessions
    };
  }

  // Helper methods
  private async incrementUserStat(userId: string, stat: keyof UserProfile['stats']): Promise<void> {
    const profile = await this.getUserProfile(userId);
    if (profile) {
      const updatedStats = { ...profile.stats };
      updatedStats[stat]++;
      await this.updateUserProfile(profile.$id, { stats: updatedStats });
    }
  }

  private async decrementUserStat(userId: string, stat: keyof UserProfile['stats']): Promise<void> {
    const profile = await this.getUserProfile(userId);
    if (profile) {
      const updatedStats = { ...profile.stats };
      updatedStats[stat] = Math.max(0, updatedStats[stat] - 1);
      await this.updateUserProfile(profile.$id, { stats: updatedStats });
    }
  }

  private async incrementImageCounter(imageId: string, counter: keyof Pick<GeneratedImage, 'favoriteCount' | 'shareCount'>): Promise<void> {
    const image = await this.getImageById(imageId);
    if (image) {
      const updates = { [counter]: image[counter] + 1 };
      await this.updateImage(imageId, updates);
    }
  }

  private async decrementImageCounter(imageId: string, counter: keyof Pick<GeneratedImage, 'favoriteCount' | 'shareCount'>): Promise<void> {
    const image = await this.getImageById(imageId);
    if (image) {
      const updates = { [counter]: Math.max(0, image[counter] - 1) };
      await this.updateImage(imageId, updates);
    }
  }
}

export const databaseService = new DatabaseService();