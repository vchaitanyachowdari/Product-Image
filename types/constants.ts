/**
 * Application constants and configuration values
 */

// File upload constants
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES: 4,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const,
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'] as const,
  COMPRESSION_QUALITY: 0.8,
} as const;

// Image processing constants
export const IMAGE_PROCESSING = {
  THUMBNAIL_SIZE: 200,
  PREVIEW_SIZE: 800,
  MAX_DIMENSION: 2048,
  FORMATS: {
    JPEG: 'image/jpeg',
    PNG: 'image/png',
    WEBP: 'image/webp',
    GIF: 'image/gif',
  },
} as const;

// API constants
export const API = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 60,
    REQUESTS_PER_HOUR: 1000,
  },
} as const;

// Authentication constants
export const AUTH = {
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
} as const;

// UI constants
export const UI = {
  BREAKPOINTS: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  ANIMATION_DURATION: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  Z_INDEX: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
    toast: 1070,
  },
} as const;

// Validation constants
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  NAME_REGEX: /^[a-zA-Z\s'-]+$/,
  USERNAME_REGEX: /^[a-zA-Z0-9_-]+$/,
  PHONE_REGEX: /^\+?[\d\s\-()]+$/,
  URL_REGEX: /^https?:\/\/.+/,
} as const;

// Error codes
export const ERROR_CODES = {
  // Authentication errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  
  // Authorization errors
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  ACCESS_DENIED: 'ACCESS_DENIED',
  
  // Validation errors
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  VALUE_TOO_LONG: 'VALUE_TOO_LONG',
  VALUE_TOO_SHORT: 'VALUE_TOO_SHORT',
  
  // File upload errors
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_CORRUPTED: 'FILE_CORRUPTED',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  CONNECTION_LOST: 'CONNECTION_LOST',
  RATE_LIMITED: 'RATE_LIMITED',
  
  // Server errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  MAINTENANCE_MODE: 'MAINTENANCE_MODE',
  
  // Business logic errors
  GENERATION_FAILED: 'GENERATION_FAILED',
  PROCESSING_ERROR: 'PROCESSING_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in',
  LOGOUT_SUCCESS: 'Successfully logged out',
  REGISTER_SUCCESS: 'Account created successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  EMAIL_VERIFIED: 'Email verified successfully',
  UPLOAD_SUCCESS: 'Images uploaded successfully',
  GENERATION_SUCCESS: 'Image generated successfully',
  COLLECTION_CREATED: 'Collection created successfully',
  COLLECTION_UPDATED: 'Collection updated successfully',
  COLLECTION_DELETED: 'Collection deleted successfully',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_STATE: 'sidebar_state',
  RECENT_SEARCHES: 'recent_searches',
  DRAFT_PROMPTS: 'draft_prompts',
} as const;

// Event names
export const EVENTS = {
  USER_LOGIN: 'user:login',
  USER_LOGOUT: 'user:logout',
  USER_REGISTER: 'user:register',
  IMAGE_UPLOAD: 'image:upload',
  IMAGE_UPLOAD_PROGRESS: 'image:upload:progress',
  IMAGE_UPLOAD_COMPLETE: 'image:upload:complete',
  IMAGE_UPLOAD_ERROR: 'image:upload:error',
  IMAGE_GENERATION_START: 'image:generation:start',
  IMAGE_GENERATION_PROGRESS: 'image:generation:progress',
  IMAGE_GENERATION_COMPLETE: 'image:generation:complete',
  IMAGE_GENERATION_ERROR: 'image:generation:error',
  COLLECTION_CREATED: 'collection:created',
  COLLECTION_UPDATED: 'collection:updated',
  COLLECTION_DELETED: 'collection:deleted',
  THEME_CHANGED: 'theme:changed',
  ERROR_OCCURRED: 'error:occurred',
} as const;

// Feature flags
export const FEATURES = {
  ANALYTICS: 'analytics',
  ERROR_REPORTING: 'error_reporting',
  PERFORMANCE_MONITORING: 'performance_monitoring',
  BETA_FEATURES: 'beta_features',
  ADVANCED_GENERATION: 'advanced_generation',
  COLLECTIONS: 'collections',
  SHARING: 'sharing',
  COMMENTS: 'comments',
} as const;

// Environment-specific configurations
export const ENV_CONFIG = {
  development: {
    API_BASE_URL: 'http://localhost:3001',
    LOG_LEVEL: 'debug',
    ENABLE_DEVTOOLS: true,
    MOCK_API: false,
  },
  staging: {
    API_BASE_URL: 'https://api-staging.productplacer.com',
    LOG_LEVEL: 'info',
    ENABLE_DEVTOOLS: true,
    MOCK_API: false,
  },
  production: {
    API_BASE_URL: 'https://api.productplacer.com',
    LOG_LEVEL: 'error',
    ENABLE_DEVTOOLS: false,
    MOCK_API: false,
  },
} as const;

// Type helpers for constants
export type FileUploadConstant = typeof FILE_UPLOAD;
export type ImageProcessingConstant = typeof IMAGE_PROCESSING;
export type ApiConstant = typeof API;
export type AuthConstant = typeof AUTH;
export type UIConstant = typeof UI;
export type ValidationConstant = typeof VALIDATION;
export type ErrorCode = keyof typeof ERROR_CODES;
export type SuccessMessage = keyof typeof SUCCESS_MESSAGES;
export type StorageKey = keyof typeof STORAGE_KEYS;
export type EventName = keyof typeof EVENTS;
export type FeatureFlag = keyof typeof FEATURES;