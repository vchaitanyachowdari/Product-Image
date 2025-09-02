/**
 * Utility types for enhanced type safety and developer experience
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

// Make all properties optional recursively
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Make all properties required recursively
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// Pick properties that are of a certain type
export type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

// Omit properties that are of a certain type
export type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

// Make specific properties optional
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Make specific properties required
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Extract function parameters
export type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

// Extract function return type
export type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

// Create a union of all values in an object
export type ValueOf<T> = T[keyof T];

// Create a union of all keys in an object as strings
export type KeysOf<T> = keyof T extends string ? keyof T : never;

// Flatten nested object types
export type Flatten<T> = T extends object ? { [K in keyof T]: Flatten<T[K]> } : T;

// Create a type that excludes null and undefined
export type NonNullable<T> = T extends null | undefined ? never : T;

// Create a type that only includes string keys
export type StringKeys<T> = Extract<keyof T, string>;

// Create a type that only includes number keys
export type NumberKeys<T> = Extract<keyof T, number>;

// Create a type that only includes symbol keys
export type SymbolKeys<T> = Extract<keyof T, symbol>;

// Create a branded type for better type safety
export type Brand<T, B> = T & { __brand: B };

// Common branded types
export type UserId = Brand<string, 'UserId'>;
export type ImageId = Brand<string, 'ImageId'>;
export type CollectionId = Brand<string, 'CollectionId'>;
export type SessionId = Brand<string, 'SessionId'>;
export type RequestId = Brand<string, 'RequestId'>;

// Email type with validation
export type Email = Brand<string, 'Email'>;

// URL type with validation
export type URL = Brand<string, 'URL'>;

// ISO date string type
export type ISODateString = Brand<string, 'ISODateString'>;

// Base64 encoded string type
export type Base64String = Brand<string, 'Base64String'>;

// JWT token type
export type JWTToken = Brand<string, 'JWTToken'>;

// Create a type for async function states
export type AsyncState<T, E = Error> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E };

// Create a type for paginated results
export type PaginatedResult<T> = {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

// Create a type for API endpoints
export type ApiEndpoint<TRequest = void, TResponse = any> = {
  request: TRequest;
  response: TResponse;
};

// Create a type for event handlers
export type EventHandler<T = any> = (event: T) => void;

// Create a type for async event handlers
export type AsyncEventHandler<T = any> = (event: T) => Promise<void>;

// Create a type for component refs
export type ComponentRef<T = HTMLElement> = React.RefObject<T> | ((instance: T | null) => void) | null;

// Create a type for form field values
export type FormFieldValue = string | number | boolean | Date | File | null | undefined;

// Create a type for form data
export type FormData<T extends Record<string, FormFieldValue>> = {
  [K in keyof T]: T[K];
};

// Create a type for validation results
export type ValidationResult<T = any> = {
  isValid: boolean;
  errors: Array<{
    field: keyof T;
    message: string;
    code?: string;
  }>;
  warnings?: Array<{
    field: keyof T;
    message: string;
    code?: string;
  }>;
};

// Create a type for API error responses
export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: string;
  requestId?: string;
};

// Create a type for API success responses
export type ApiSuccessResponse<T = any> = {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
  requestId?: string;
};

// Union type for all API responses
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// Create a type for environment variables
export type Environment = 'development' | 'staging' | 'production' | 'test';

// Create a type for log levels
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

// Create a type for HTTP methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

// Create a type for HTTP status codes
export type HttpStatusCode = 
  | 200 | 201 | 202 | 204
  | 400 | 401 | 403 | 404 | 409 | 422 | 429
  | 500 | 502 | 503 | 504;

// Create a type for MIME types
export type MimeType = 
  | 'image/jpeg'
  | 'image/png' 
  | 'image/webp'
  | 'image/gif'
  | 'application/json'
  | 'text/plain'
  | 'text/html';

// Create a type for file extensions
export type FileExtension = '.jpg' | '.jpeg' | '.png' | '.webp' | '.gif' | '.json' | '.txt' | '.html';

// Create a type for color formats
export type ColorFormat = 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla';

// Create a type for breakpoints
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Create a type for responsive values
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

// Create a type for theme tokens
export type ThemeToken<T> = T | `var(--${string})`;

// Create a type for CSS properties
export type CSSProperty = string | number;

// Create a type for style objects
export type StyleObject = Record<string, CSSProperty>;

// Create a type for class names
export type ClassName = string | undefined | null | false | Record<string, boolean> | ClassName[];

// Helper type to ensure exhaustive switch statements
export type Never = never;

// Helper type to create a discriminated union
export type DiscriminatedUnion<T, K extends keyof T> = T extends any ? { [P in K]: T[P] } & T : never;

// Helper type to create optional properties with default values
export type WithDefaults<T, D extends Partial<T>> = T & D;

// Helper type to create a readonly version of an object
export type Immutable<T> = {
  readonly [P in keyof T]: T[P] extends object ? Immutable<T[P]> : T[P];
};

// Helper type to create a mutable version of a readonly object
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P] extends object ? Mutable<T[P]> : T[P];
};