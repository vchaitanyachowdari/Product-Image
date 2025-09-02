/**
 * Error handling type definitions
 */

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ErrorCategory = 
  | 'validation'
  | 'authentication'
  | 'authorization'
  | 'network'
  | 'server'
  | 'client'
  | 'business'
  | 'system'
  | 'external';

// Base error interface
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  severity: ErrorSeverity;
  category: ErrorCategory;
  userMessage?: string;
  technicalMessage?: string;
  stack?: string;
  requestId?: string;
  userId?: string;
}

// Specific error types
export interface ValidationError extends AppError {
  category: 'validation';
  field?: string;
  value?: any;
  constraints?: string[];
}

export interface AuthenticationError extends AppError {
  category: 'authentication';
  reason: 'invalid_credentials' | 'token_expired' | 'token_invalid' | 'account_locked' | 'email_not_verified';
}

export interface AuthorizationError extends AppError {
  category: 'authorization';
  requiredPermission?: string;
  userRole?: string;
  resource?: string;
}

export interface NetworkError extends AppError {
  category: 'network';
  statusCode?: number;
  url?: string;
  method?: string;
  timeout?: boolean;
  offline?: boolean;
}

export interface FileUploadError extends AppError {
  category: 'validation' | 'business';
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  reason: 'file_too_large' | 'invalid_type' | 'corrupted' | 'virus_detected' | 'quota_exceeded';
}

export interface ImageProcessingError extends AppError {
  category: 'business' | 'external';
  imageId?: string;
  operation: 'upload' | 'compression' | 'generation' | 'validation';
  reason?: string;
}

export interface ExternalServiceError extends AppError {
  category: 'external';
  service: 'gemini' | 'storage' | 'analytics' | 'email';
  statusCode?: number;
  retryable: boolean;
}

// Error context for debugging
export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  userAgent?: string;
  url?: string;
  method?: string;
  timestamp: Date;
  environment: 'development' | 'staging' | 'production';
  version: string;
  additionalData?: Record<string, any>;
}

// Error reporting
export interface ErrorReport {
  error: AppError;
  context: ErrorContext;
  breadcrumbs?: Breadcrumb[];
  tags?: Record<string, string>;
  fingerprint?: string[];
}

export interface Breadcrumb {
  timestamp: Date;
  message: string;
  category: string;
  level: 'debug' | 'info' | 'warning' | 'error';
  data?: Record<string, any>;
}

// Error boundary state
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId?: string;
}

// Error recovery
export interface ErrorRecoveryAction {
  type: 'retry' | 'reload' | 'redirect' | 'reset' | 'ignore';
  label: string;
  handler: () => void | Promise<void>;
  primary?: boolean;
}

export interface ErrorRecoveryOptions {
  showDetails?: boolean;
  actions?: ErrorRecoveryAction[];
  autoRetry?: {
    enabled: boolean;
    maxAttempts: number;
    delay: number;
  };
}

// User-friendly error messages
export interface UserErrorMessage {
  title: string;
  description: string;
  action?: string;
  icon?: string;
  type: 'error' | 'warning' | 'info';
}

// Error statistics and monitoring
export interface ErrorStats {
  total: number;
  byCategory: Record<ErrorCategory, number>;
  bySeverity: Record<ErrorSeverity, number>;
  byCode: Record<string, number>;
  timeRange: {
    start: Date;
    end: Date;
  };
}

// Retry configuration
export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  jitter: boolean;
  retryCondition?: (error: AppError) => boolean;
}

// Error handler configuration
export interface ErrorHandlerConfig {
  logErrors: boolean;
  reportErrors: boolean;
  showUserFriendlyMessages: boolean;
  enableRetry: boolean;
  retryConfig: RetryConfig;
  fallbackComponent?: React.ComponentType<{ error: AppError }>;
}