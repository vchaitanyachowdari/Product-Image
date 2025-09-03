import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  GEMINI_API_KEY: z.string().min(1, 'Gemini API key is required'),
  APPWRITE_ENDPOINT: z.string().default('https://cloud.appwrite.io/v1'),
  APPWRITE_PROJECT_ID: z.string().min(1, 'Appwrite project ID is required'),
  APPWRITE_DATABASE_ID: z.string().default('main'),
  APPWRITE_USER_COLLECTION_ID: z.string().default('users'),
  APPWRITE_IMAGES_COLLECTION_ID: z.string().default('generated_images'),
  APPWRITE_FAVORITES_COLLECTION_ID: z.string().default('favorites'),
  APPWRITE_SHARES_COLLECTION_ID: z.string().default('shares'),
  APPWRITE_STORAGE_ID: z.string().default('images'),
  APPWRITE_AVATARS_STORAGE_ID: z.string().default('avatars'),
  APP_NAME: z.string().default('Product In-Situ Placer'),
  APP_VERSION: z.string().default('2.0.0'),
  API_BASE_URL: z.string().url().optional(),
  ENABLE_ANALYTICS: z.boolean().default(false),
  MAX_FILE_SIZE: z.number().default(10 * 1024 * 1024), // 10MB
  MAX_FILES_COUNT: z.number().default(4),
  SUPPORTED_IMAGE_FORMATS: z.array(z.string()).default(['image/jpeg', 'image/png', 'image/webp']),
});

// Validate environment variables
const parseEnv = () => {
  try {
    return envSchema.parse({
      NODE_ENV: import.meta.env.MODE,
      GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
      APPWRITE_ENDPOINT: import.meta.env.VITE_APPWRITE_ENDPOINT,
      APPWRITE_PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
      APPWRITE_DATABASE_ID: import.meta.env['VITE_APPWRITE_DATABASE_ID'],
      APPWRITE_USER_COLLECTION_ID: import.meta.env['VITE_APPWRITE_USER_COLLECTION_ID'],
      APPWRITE_IMAGES_COLLECTION_ID: import.meta.env['VITE_APPWRITE_IMAGES_COLLECTION_ID'],
      APPWRITE_FAVORITES_COLLECTION_ID: import.meta.env['VITE_APPWRITE_FAVORITES_COLLECTION_ID'],
      APPWRITE_SHARES_COLLECTION_ID: import.meta.env['VITE_APPWRITE_SHARES_COLLECTION_ID'],
      APPWRITE_STORAGE_ID: import.meta.env['VITE_APPWRITE_STORAGE_ID'],
      APPWRITE_AVATARS_STORAGE_ID: import.meta.env['VITE_APPWRITE_AVATARS_STORAGE_ID'],
      APP_NAME: import.meta.env.VITE_APP_NAME,
      APP_VERSION: import.meta.env.VITE_APP_VERSION,
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
      ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
      MAX_FILE_SIZE: Number(import.meta.env.VITE_MAX_FILE_SIZE),
      MAX_FILES_COUNT: Number(import.meta.env.VITE_MAX_FILES_COUNT),
      SUPPORTED_IMAGE_FORMATS: import.meta.env.VITE_SUPPORTED_IMAGE_FORMATS?.split(','),
    });
  } catch (error) {
    if (import.meta.env.MODE === 'development') {
      // eslint-disable-next-line no-console
      console.error('Environment validation failed:', error);
    }
    throw new Error('Invalid environment configuration');
  }
};

export const env = parseEnv();

export type Env = z.infer<typeof envSchema>;

// Runtime environment checks
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';