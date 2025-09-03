/**
 * Database types for Appwrite collections
 */

export interface UserProfile {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  userId: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    publicProfile: boolean;
  };
  stats: {
    imagesGenerated: number;
    favoriteCount: number;
    shareCount: number;
  };
}

export interface GeneratedImage {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  userId: string;
  title: string;
  description?: string;
  prompt: string;
  imageUrl: string;
  thumbnailUrl?: string;
  originalImageUrl: string;
  settings: {
    model: string;
    style?: string;
    quality?: string;
    size?: string;
  };
  metadata: {
    fileSize: number;
    dimensions: {
      width: number;
      height: number;
    };
    format: string;
  };
  isPublic: boolean;
  tags: string[];
  favoriteCount: number;
  shareCount: number;
}

export interface Favorite {
  $id: string;
  $createdAt: string;
  userId: string;
  imageId: string;
}

export interface Share {
  $id: string;
  $createdAt: string;
  userId: string;
  imageId: string;
  shareUrl: string;
  expiresAt?: string;
  viewCount: number;
  isActive: boolean;
}

export interface AdminUser {
  $id: string;
  userId: string;
  role: 'admin' | 'moderator';
  permissions: string[];
  createdBy: string;
  $createdAt: string;
}

export interface SystemStats {
  totalUsers: number;
  totalImages: number;
  totalShares: number;
  storageUsed: number;
  activeUsers: number;
}