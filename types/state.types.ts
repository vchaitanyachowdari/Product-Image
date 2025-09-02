/**
 * State management type definitions
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { AppError } from './error.types';
import { UploadedImage, GeneratedImage, ImageCollection } from './image.types';
import { User, UserPreferences } from './user.types';

// Auth state slice
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AppError | null;
  sessionExpiry: Date | null;
  rememberMe: boolean;
}

export interface AuthActions {
  login: (credentials: import('./user.types').LoginCredentials) => Promise<void>;
  register: (userData: import('./user.types').RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  clearError: () => void;
  setRememberMe: (remember: boolean) => void;
}

// Images state slice
export interface ImagesState {
  uploaded: UploadedImage[];
  generated: GeneratedImage[];
  collections: ImageCollection[];
  isUploading: boolean;
  isGenerating: boolean;
  uploadProgress: Record<string, number>;
  generationProgress: Record<string, number>;
  error: AppError | null;
  selectedImages: string[];
  currentCollection: string | null;
}

export interface ImagesActions {
  uploadImages: (files: File[]) => Promise<void>;
  removeImage: (imageId: string) => void;
  generateImage: (params: import('./image.types').GenerationParameters) => Promise<void>;
  cancelGeneration: (generationId: string) => void;
  selectImage: (imageId: string) => void;
  deselectImage: (imageId: string) => void;
  selectAllImages: () => void;
  deselectAllImages: () => void;
  createCollection: (name: string, imageIds: string[]) => Promise<void>;
  updateCollection: (collectionId: string, updates: Partial<ImageCollection>) => Promise<void>;
  deleteCollection: (collectionId: string) => Promise<void>;
  setCurrentCollection: (collectionId: string | null) => void;
  clearError: () => void;
}

// UI state slice
export interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  activeModal: string | null;
  notifications: Notification[];
  loading: Record<string, boolean>;
  errors: Record<string, AppError>;
  toasts: Toast[];
  preferences: UIPreferences;
}

export interface UIActions {
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (notificationId: string) => void;
  clearNotifications: () => void;
  setLoading: (key: string, loading: boolean) => void;
  setError: (key: string, error: AppError | null) => void;
  clearError: (key: string) => void;
  clearAllErrors: () => void;
  addToast: (toast: Omit<Toast, 'id' | 'timestamp'>) => void;
  removeToast: (toastId: string) => void;
  updatePreferences: (preferences: Partial<UIPreferences>) => void;
}

// Notification types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actions?: NotificationAction[];
  persistent?: boolean;
}

export interface NotificationAction {
  label: string;
  action: () => void;
  primary?: boolean;
}

// Toast types
export interface Toast {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  timestamp: Date;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    handler: () => void;
  };
}

// UI preferences
export interface UIPreferences {
  compactMode: boolean;
  showThumbnails: boolean;
  gridColumns: number;
  autoSave: boolean;
  confirmDeletions: boolean;
  showTooltips: boolean;
  animationsEnabled: boolean;
  soundEnabled: boolean;
}

// App store (root state)
export interface AppStore {
  auth: AuthState;
  images: ImagesState;
  ui: UIState;
  
  // Combined actions
  actions: {
    auth: AuthActions;
    images: ImagesActions;
    ui: UIActions;
  };
}

// Store configuration
export interface StoreConfig {
  persist?: {
    enabled: boolean;
    key: string;
    storage: 'localStorage' | 'sessionStorage';
    whitelist?: string[];
    blacklist?: string[];
  };
  devtools?: boolean;
  middleware?: any[];
}

// Async action states
export type AsyncActionState = 'idle' | 'pending' | 'fulfilled' | 'rejected';

export interface AsyncAction<T = any> {
  state: AsyncActionState;
  data: T | null;
  error: AppError | null;
  lastUpdated: Date | null;
}

// Selectors
export type Selector<T> = (state: AppStore) => T;

export interface AppSelectors {
  // Auth selectors
  selectUser: Selector<User | null>;
  selectIsAuthenticated: Selector<boolean>;
  selectAuthLoading: Selector<boolean>;
  selectAuthError: Selector<AppError | null>;
  
  // Images selectors
  selectUploadedImages: Selector<UploadedImage[]>;
  selectGeneratedImages: Selector<GeneratedImage[]>;
  selectSelectedImages: Selector<UploadedImage[]>;
  selectIsUploading: Selector<boolean>;
  selectIsGenerating: Selector<boolean>;
  selectImagesError: Selector<AppError | null>;
  
  // UI selectors
  selectTheme: Selector<'light' | 'dark' | 'system'>;
  selectSidebarOpen: Selector<boolean>;
  selectActiveModal: Selector<string | null>;
  selectNotifications: Selector<Notification[]>;
  selectUnreadNotifications: Selector<Notification[]>;
  selectToasts: Selector<Toast[]>;
}

// Store hooks
export interface StoreHooks {
  useAuth: () => AuthState & { actions: AuthActions };
  useImages: () => ImagesState & { actions: ImagesActions };
  useUI: () => UIState & { actions: UIActions };
  useSelector: <T>(selector: Selector<T>) => T;
  useStore: () => AppStore;
}

// Middleware types
export interface StoreMiddleware {
  name: string;
  middleware: (store: any) => (next: any) => (action: any) => any;
}

// Action types for debugging
export interface StoreAction {
  type: string;
  payload?: any;
  meta?: {
    timestamp: Date;
    source: string;
  };
}