import { env } from './env';

// Application constants
export const APP_CONFIG = {
  name: env.APP_NAME,
  version: env.APP_VERSION,
  description: 'AI-powered product placement in realistic environments',
} as const;

// File upload constants
export const FILE_CONFIG = {
  maxSize: env.MAX_FILE_SIZE,
  maxCount: env.MAX_FILES_COUNT,
  supportedFormats: env.SUPPORTED_IMAGE_FORMATS,
  acceptedTypes: env.SUPPORTED_IMAGE_FORMATS.join(', '),
} as const;

// API constants
export const API_CONFIG = {
  baseUrl: env.API_BASE_URL || '',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
} as const;

// UI constants
export const UI_CONFIG = {
  loadingMessages: [
    'Placing your products in a new world...',
    'AI is getting creative with your items...',
    'Composing the perfect scene...',
    'Rendering pixels of perfection...',
    'Hold tight, magic is happening...',
  ],
  toastDuration: 5000, // 5 seconds
  modalAnimationDuration: 200, // 200ms
} as const;

// Gemini API constants
export const GEMINI_CONFIG = {
  model: 'gemini-2.5-flash-image-preview',
  maxTokens: 4096,
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  generic: 'An unexpected error occurred. Please try again.',
  network: 'Network error. Please check your connection and try again.',
  fileUpload: 'Failed to upload file. Please try again.',
  fileSize: `File size must be less than ${FILE_CONFIG.maxSize / (1024 * 1024)}MB`,
  fileFormat: `Only ${FILE_CONFIG.supportedFormats.join(', ')} files are supported`,
  maxFiles: `You can upload a maximum of ${FILE_CONFIG.maxCount} images`,
  noImages: 'Please upload at least one product image',
  generation: 'Failed to generate image. Please try a different prompt or image.',
  auth: 'Authentication failed. Please check your credentials.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  login: 'Successfully logged in!',
  register: 'Account created successfully!',
  imageGenerated: 'Image generated successfully!',
  imageUploaded: 'Images uploaded successfully!',
} as const;

// Routes
export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  authToken: 'auth_token',
  userPreferences: 'user_preferences',
  recentPrompts: 'recent_prompts',
} as const;