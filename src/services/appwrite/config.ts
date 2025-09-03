/**
 * Appwrite configuration and client setup
 */

import { Client, Account, Databases, Storage } from 'appwrite';

import { env } from '@/src/config';

// Initialize Appwrite client
export const client = new Client()
  .setEndpoint(env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(env.APPWRITE_PROJECT_ID || '');

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Appwrite configuration constants
export const APPWRITE_CONFIG = {
  databaseId: env.APPWRITE_DATABASE_ID || 'main',
  userCollectionId: env.APPWRITE_USER_COLLECTION_ID || 'users',
  imagesCollectionId: env.APPWRITE_IMAGES_COLLECTION_ID || 'generated_images',
  favoritesCollectionId: env.APPWRITE_FAVORITES_COLLECTION_ID || 'favorites',
  sharesCollectionId: env.APPWRITE_SHARES_COLLECTION_ID || 'shares',
  storageId: env.APPWRITE_STORAGE_ID || 'images',
  avatarsStorageId: env.APPWRITE_AVATARS_STORAGE_ID || 'avatars',
} as const;

export default client;