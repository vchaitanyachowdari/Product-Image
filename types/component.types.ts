/**
 * Component prop types and UI-related type definitions
 */

import { ReactNode } from 'react';

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  testId?: string;
}

// Button component types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends BaseComponentProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  form?: string;
}

// Input component types
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputState = 'default' | 'error' | 'success' | 'warning';

export interface InputProps extends BaseComponentProps {
  type?: InputType;
  size?: InputSize;
  state?: InputState;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

// Form field component types
export interface FormFieldProps extends BaseComponentProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
}

// Modal component types
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  preventScroll?: boolean;
}

// Image component types
export interface ImageProps extends BaseComponentProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
}

// Avatar component types
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface AvatarProps extends BaseComponentProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  fallback?: ReactNode;
  onClick?: () => void;
}

// Badge component types
export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends BaseComponentProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

// Spinner component types
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface SpinnerProps extends BaseComponentProps {
  size?: SpinnerSize;
  color?: string;
}

// Progress bar component types
export interface ProgressBarProps extends BaseComponentProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  label?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

// Image uploader component types
export interface ImageUploaderProps extends BaseComponentProps {
  onImageUpload: (files: File[]) => void;
  onRemoveImage?: (index: number) => void;
  imagePreviewUrls?: string[];
  maxFiles?: number;
  maxFileSize?: number;
  acceptedTypes?: string[];
  disabled?: boolean;
  loading?: boolean;
  error?: string;
}

// Image gallery component types
export interface ImageGalleryProps extends BaseComponentProps {
  images: Array<{
    id: string;
    src: string;
    alt: string;
    thumbnail?: string;
  }>;
  onImageClick?: (image: any, index: number) => void;
  onImageDelete?: (imageId: string) => void;
  loading?: boolean;
  columns?: number;
  gap?: number;
}

// Navigation component types
export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
  children?: NavigationItem[];
}

export interface NavigationProps extends BaseComponentProps {
  items: NavigationItem[];
  activeItem?: string;
  onItemClick?: (item: NavigationItem) => void;
  collapsed?: boolean;
}

// Layout component types
export interface LayoutProps extends BaseComponentProps {
  header?: ReactNode;
  sidebar?: ReactNode;
  footer?: ReactNode;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

// Theme and styling types
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  mode: ThemeMode;
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
  fonts: {
    sans: string;
    mono: string;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
}

// Event handler types
export type ClickHandler = (event: React.MouseEvent) => void;
export type ChangeHandler<T = string> = (value: T) => void;
export type SubmitHandler = (event: React.FormEvent) => void;
export type KeyboardHandler = (event: React.KeyboardEvent) => void;

// Generic component types
export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ComponentState = 'default' | 'loading' | 'success' | 'error' | 'disabled';

// Responsive types
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

// Animation types
export type AnimationType = 'fade' | 'slide' | 'scale' | 'bounce' | 'spin';
export type AnimationDuration = 'fast' | 'normal' | 'slow';

export interface AnimationProps {
  animation?: AnimationType;
  duration?: AnimationDuration;
  delay?: number;
  repeat?: boolean | number;
}