/**
 * API-related type definitions
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

// Generic API response wrapper
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: ValidationError[];
  meta?: ResponseMeta;
}

export interface ResponseMeta {
  timestamp: string;
  requestId: string;
  version: string;
  pagination?: PaginationMeta;
  rateLimit?: RateLimitInfo;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

// Request/Response types for specific endpoints
export interface UploadResponse {
  images: Array<{
    id: string;
    url: string;
    thumbnailUrl: string;
    metadata: import('./image.types').ImageMetadata;
  }>;
  uploadId: string;
}

export interface GenerationResponse {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
  prompt: string;
  status: import('./image.types').GenerationStatus;
  metadata: import('./image.types').GenerationMetadata;
  estimatedTime?: number;
}

export interface UserResponse {
  user: import('./user.types').User;
}

export interface UsersListResponse {
  users: import('./user.types').User[];
  pagination: PaginationMeta;
}

// API Error types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  field?: string;
  timestamp: string;
  requestId?: string;
}

export interface ValidationError {
  field: string;
  code: string;
  message: string;
  value?: any;
}

// Request configuration
export interface ApiRequestConfig {
  method: HttpMethod;
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  signal?: AbortSignal;
}

// Authentication headers
export interface AuthHeaders {
  Authorization: string;
  'X-API-Key'?: string;
  'X-Client-Version'?: string;
}

// File upload specific types
export interface UploadRequest {
  files: File[];
  metadata?: Record<string, any>;
  tags?: string[];
  isPublic?: boolean;
}

export interface GenerationRequest {
  imageIds: string[];
  prompt: string;
  style?: import('./image.types').GenerationStyle;
  quality?: import('./image.types').GenerationQuality;
  parameters?: Partial<import('./image.types').GenerationParameters>;
}

// Batch operations
export interface BatchRequest<T> {
  items: T[];
  batchId?: string;
}

export interface BatchResponse<T> {
  results: Array<{
    item: T;
    success: boolean;
    error?: ApiError;
  }>;
  batchId: string;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

// Webhook types
export interface WebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  signature: string;
}

export interface WebhookEvent {
  id: string;
  type: 'image.uploaded' | 'image.generated' | 'user.created' | 'user.updated';
  data: any;
  createdAt: Date;
}

// API client configuration
export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
  headers: Record<string, string>;
  interceptors?: {
    request?: Array<(config: ApiRequestConfig) => ApiRequestConfig>;
    response?: Array<(response: any) => any>;
  };
}

// Health check and status
export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  services: Record<string, ServiceStatus>;
  uptime: number;
}

export interface ServiceStatus {
  status: 'up' | 'down' | 'degraded';
  responseTime?: number;
  lastCheck: string;
  error?: string;
}