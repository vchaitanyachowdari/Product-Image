/**
 * Test file to verify all types compile correctly
 * This file should not be included in the build
 */

import {
  loginCredentialsSchema,
  registerDataSchema,
  fileUploadSchema,
  generationRequestSchema,
  type User,
  type UploadedImage,
  type ApiResponse,
  type AppError,
  type AuthState,
  type ImagesState,
  type UIState,
  type DeepPartial,
  type Brand,
  type AsyncState,
  type PaginatedResult,
} from './index';


// Test basic type usage
const testUser: User = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  subscription: 'free',
  role: 'user',
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLoginAt: new Date(),
  isEmailVerified: true,
  preferences: {
    theme: 'light',
    language: 'en',
    notifications: {
      email: true,
      push: false,
      marketing: false,
    },
    privacy: {
      profileVisible: true,
      analyticsOptOut: false,
    },
  },
};

const testImage: UploadedImage = {
  id: 'img-123',
  file: new File([''], 'test.jpg', { type: 'image/jpeg' }),
  preview: 'data:image/jpeg;base64,test',
  uploadProgress: 100,
  status: 'uploaded',
  metadata: {
    width: 1920,
    height: 1080,
    size: 1024000,
    format: 'jpeg',
    hasAlpha: false,
    uploadedAt: new Date(),
  },
  userId: 'user-123',
  originalName: 'test.jpg',
  tags: ['product', 'test'],
  createdAt: new Date(),
  updatedAt: new Date(),
};



// Test validation schemas
const validLoginData = {
  email: 'test@example.com',
  password: 'SecurePass123!',
  rememberMe: true,
};

const loginValidation = loginCredentialsSchema.safeParse(validLoginData);
if (loginValidation.success) {
  // eslint-disable-next-line no-console
  console.log('Login data is valid:', loginValidation.data);
}

const validRegisterData = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'SecurePass123!',
  confirmPassword: 'SecurePass123!',
  acceptTerms: true,
};

const registerValidation = registerDataSchema.safeParse(validRegisterData);
if (registerValidation.success) {
  // eslint-disable-next-line no-console
  console.log('Register data is valid:', registerValidation.data);
}

// Test file validation
const testFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
const fileValidation = fileUploadSchema.safeParse({ file: testFile });
if (fileValidation.success) {
  // eslint-disable-next-line no-console
  console.log('File is valid:', fileValidation.data);
}

// Test generation request
const generationRequest = {
  imageIds: ['img-123', 'img-456'],
  prompt: 'Place these products in a modern living room',
  style: 'realistic' as const,
  quality: 'high' as const,
};

const generationValidation = generationRequestSchema.safeParse(generationRequest);
if (generationValidation.success) {
  // eslint-disable-next-line no-console
  console.log('Generation request is valid:', generationValidation.data);
}

// Test state types
const testAuthState: AuthState = {
  user: testUser,
  isAuthenticated: true,
  isLoading: false,
  error: null,
  sessionExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
  rememberMe: true,
};

const testImagesState: ImagesState = {
  uploaded: [testImage],
  generated: [],
  collections: [],
  isUploading: false,
  isGenerating: false,
  uploadProgress: {},
  generationProgress: {},
  error: null,
  selectedImages: [],
  currentCollection: null,
};

const testUIState: UIState = {
  theme: 'light',
  sidebarOpen: true,
  activeModal: null,
  notifications: [],
  loading: {},
  errors: {},
  toasts: [],
  preferences: {
    compactMode: false,
    showThumbnails: true,
    gridColumns: 3,
    autoSave: true,
    confirmDeletions: true,
    showTooltips: true,
    animationsEnabled: true,
    soundEnabled: false,
  },
};

// Test error types
const testApiResponse: ApiResponse<User> = {
  success: true,
  data: testUser,
  message: 'User retrieved successfully',
  timestamp: new Date(),
};

const testAppError: AppError = {
  code: 'VALIDATION_ERROR',
  message: 'Invalid input data',
  details: { field: 'email', reason: 'Invalid format' },
  timestamp: new Date(),
  requestId: 'req-123',
};

// Test utility types

type PartialUser = DeepPartial<User>;
type UserId = Brand<string, 'UserId'>;
type UserAsyncState = AsyncState<User>;
type UsersPaginated = PaginatedResult<User>;

const partialUser: PartialUser = {
  name: 'Updated Name',
  preferences: {
    theme: 'dark',
  },
};

const userId: UserId = 'user-123' as UserId;

const userAsyncState: UserAsyncState = {
  status: 'success',
  data: testUser,
};

const usersPaginated: UsersPaginated = {
  items: [testUser],
  pagination: {
    page: 1,
    limit: 20,
    total: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  },
};

// eslint-disable-next-line no-console
console.log('All types compiled successfully!');
// eslint-disable-next-line no-console
console.log({ 
  partialUser, 
  userId, 
  userAsyncState, 
  usersPaginated,
  testAuthState,
  testImagesState,
  testUIState,
  testApiResponse,
  testAppError
});

export {}; // Make this a module