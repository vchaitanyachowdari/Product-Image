/**
 * Zod validation schemas for runtime type checking
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { z } from 'zod';

// User validation schemas
export const loginCredentialsSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(255, 'Email too long'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long'),
  rememberMe: z.boolean().optional(),
});

export const registerDataSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(255, 'Email too long'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  language: z.string().min(2).max(10),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    marketing: z.boolean(),
  }),
  privacy: z.object({
    profileVisible: z.boolean(),
    analyticsOptOut: z.boolean(),
  }),
});

export const passwordResetSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// File upload validation schemas
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(file => file.size > 0, 'File cannot be empty')
    .refine(file => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine(
      file => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type),
      'File must be a valid image (JPEG, PNG, WebP, or GIF)'
    ),
});

export const multipleFilesUploadSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(1, 'At least one file is required')
    .max(4, 'Maximum 4 files allowed')
    .refine(
      files => files.every(file => file.size <= 10 * 1024 * 1024),
      'Each file must be less than 10MB'
    )
    .refine(
      files => files.every(file => 
        ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)
      ),
      'All files must be valid images (JPEG, PNG, WebP, or GIF)'
    ),
  metadata: z.record(z.string(), z.any()).optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
});

// Image generation validation schemas
export const generationParametersSchema = z.object({
  prompt: z
    .string()
    .min(10, 'Prompt must be at least 10 characters')
    .max(500, 'Prompt must be less than 500 characters')
    .refine(
      text => !containsProfanity(text),
      'Prompt contains inappropriate content'
    ),
  style: z.enum(['realistic', 'artistic', 'minimal', 'vintage', 'modern']).optional(),
  quality: z.enum(['standard', 'high', 'ultra']).optional(),
  aspectRatio: z.string().regex(/^\d+:\d+$/, 'Invalid aspect ratio format').optional(),
  seed: z.number().int().min(0).max(2147483647).optional(),
  steps: z.number().int().min(1).max(100).optional(),
  guidance: z.number().min(0).max(20).optional(),
  negativePrompt: z.string().max(200, 'Negative prompt too long').optional(),
});

export const generationRequestSchema = z.object({
  imageIds: z
    .array(z.string().uuid('Invalid image ID format'))
    .min(1, 'At least one image is required')
    .max(4, 'Maximum 4 images allowed'),
  prompt: z
    .string()
    .min(10, 'Prompt must be at least 10 characters')
    .max(500, 'Prompt must be less than 500 characters'),
  style: z.enum(['realistic', 'artistic', 'minimal', 'vintage', 'modern']).default('realistic'),
  quality: z.enum(['standard', 'high', 'ultra']).default('standard'),
  parameters: generationParametersSchema.partial().optional(),
});

// Collection validation schemas
export const imageCollectionSchema = z.object({
  name: z
    .string()
    .min(1, 'Collection name is required')
    .max(100, 'Collection name too long')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Collection name contains invalid characters'),
  description: z.string().max(500, 'Description too long').optional(),
  images: z.array(z.string().uuid()).max(100, 'Maximum 100 images per collection'),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string().max(50)).max(10, 'Maximum 10 tags allowed').optional(),
});

// Search and filtering schemas
export const imageSearchFiltersSchema = z.object({
  tags: z.array(z.string()).optional(),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).refine(data => data.start <= data.end, {
    message: 'Start date must be before end date',
  }).optional(),
  status: z.array(z.enum(['uploading', 'uploaded', 'processing', 'completed', 'error', 'cancelled'])).optional(),
  format: z.array(z.enum(['jpeg', 'png', 'webp', 'gif'])).optional(),
  sizeRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }).refine(data => data.min <= data.max, {
    message: 'Minimum size must be less than or equal to maximum size',
  }).optional(),
  userId: z.string().uuid().optional(),
  isPublic: z.boolean().optional(),
});

// API request validation schemas
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any(),
  errors: z.array(z.object({
    field: z.string(),
    code: z.string(),
    message: z.string(),
    value: z.any().optional(),
  })).optional(),
  meta: z.object({
    timestamp: z.string(),
    requestId: z.string(),
    version: z.string(),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
      hasNext: z.boolean(),
      hasPrev: z.boolean(),
    }).optional(),
  }).optional(),
});

// Environment configuration schema
export const envConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  API_BASE_URL: z.string().url(),
  GEMINI_API_KEY: z.string().min(1),
  UPLOAD_MAX_SIZE: z.string().regex(/^\d+[KMGT]?B?$/i).optional(),
  UPLOAD_MAX_FILES: z.string().regex(/^\d+$/).optional(),
  ANALYTICS_ID: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
});

// Utility validation functions
export function containsProfanity(text: string): boolean {
  // Simple profanity check - in production, use a proper service
  const profanityWords = ['spam', 'scam', 'hack', 'virus'];
  const lowerText = text.toLowerCase();
  return profanityWords.some(word => lowerText.includes(word));
}

export function validateFileSignature(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer;
      const bytes = new Uint8Array(buffer.slice(0, 4));
      
      // Check for valid image signatures
      const signatures = {
        jpeg: [0xff, 0xd8, 0xff],
        png: [0x89, 0x50, 0x4e, 0x47],
        webp: [0x52, 0x49, 0x46, 0x46],
        gif: [0x47, 0x49, 0x46, 0x38],
      };
      
      const isValid = Object.values(signatures).some(sig =>
        sig.every((byte, i) => bytes[i] === byte)
      );
      
      resolve(isValid);
    };
    reader.onerror = () => resolve(false);
    reader.readAsArrayBuffer(file.slice(0, 4));
  });
}

// Custom Zod refinements
export const customFileValidation = z
  .instanceof(File)
  .refine(async (file) => {
    return await validateFileSignature(file);
  }, 'Invalid file signature - file may be corrupted or not a valid image');

// Type inference helpers
export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;
export type RegisterData = z.infer<typeof registerDataSchema>;
export type UserPreferences = z.infer<typeof userPreferencesSchema>;
export type GenerationParameters = z.infer<typeof generationParametersSchema>;
export type GenerationRequest = z.infer<typeof generationRequestSchema>;
export type ImageCollection = z.infer<typeof imageCollectionSchema>;
export type ImageSearchFilters = z.infer<typeof imageSearchFiltersSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
export type ApiResponse<T = any> = z.infer<typeof apiResponseSchema> & { data: T };
export type EnvConfig = z.infer<typeof envConfigSchema>;