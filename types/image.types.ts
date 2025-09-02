/**
 * Image and file handling type definitions
 */

export type ImageStatus = 'uploading' | 'uploaded' | 'processing' | 'completed' | 'error' | 'cancelled';

export type GenerationStatus = 'pending' | 'generating' | 'completed' | 'failed' | 'cancelled';

export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'gif';

export type GenerationStyle = 'realistic' | 'artistic' | 'minimal' | 'vintage' | 'modern';

export type GenerationQuality = 'standard' | 'high' | 'ultra';

export interface ImageMetadata {
  width: number;
  height: number;
  size: number;
  format: ImageFormat;
  colorSpace?: string;
  hasAlpha: boolean;
  dpi?: number;
  exif?: Record<string, any>;
  uploadedAt: Date;
}

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  uploadProgress: number;
  status: ImageStatus;
  metadata: ImageMetadata;
  userId: string;
  originalName: string;
  url?: string;
  thumbnailUrl?: string;
  tags: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GeneratedImage {
  id: string;
  originalImages: string[]; // Array of image IDs
  prompt: string;
  result: string; // Base64 or URL
  status: GenerationStatus;
  style: GenerationStyle;
  quality: GenerationQuality;
  metadata: GenerationMetadata;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  likes: number;
  views: number;
  tags: string[];
}

export interface GenerationMetadata {
  model: string;
  version: string;
  processingTime: number;
  parameters: GenerationParameters;
  cost?: number;
  errorDetails?: string;
}

export interface GenerationParameters {
  prompt: string;
  style: GenerationStyle;
  quality: GenerationQuality;
  aspectRatio?: string;
  seed?: number;
  steps?: number;
  guidance?: number;
  negativePrompt?: string;
}

// File upload related types
export interface FileUploadConfig {
  maxFileSize: number; // in bytes
  allowedTypes: string[];
  maxFiles: number;
  compressionQuality: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed?: number; // bytes per second
  timeRemaining?: number; // seconds
}

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Image processing types
export interface ImageProcessingOptions {
  resize?: {
    width?: number;
    height?: number;
    fit: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  };
  quality?: number;
  format?: ImageFormat;
  progressive?: boolean;
  strip?: boolean;
}

export interface ImageCompressionResult {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  blob: Blob;
}

// Gallery and collection types
export interface ImageCollection {
  id: string;
  name: string;
  description?: string;
  images: string[]; // Array of image IDs
  userId: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  coverImageId?: string;
}

export interface ImageHistory {
  id: string;
  userId: string;
  images: UploadedImage[];
  generations: GeneratedImage[];
  collections: ImageCollection[];
  totalUploads: number;
  totalGenerations: number;
  storageUsed: number; // in bytes
  lastActivity: Date;
}

// Search and filtering
export interface ImageSearchFilters {
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: ImageStatus[];
  format?: ImageFormat[];
  sizeRange?: {
    min: number;
    max: number;
  };
  userId?: string;
  isPublic?: boolean;
}

export interface ImageSearchResult {
  images: UploadedImage[];
  generations: GeneratedImage[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}