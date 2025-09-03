/**
 * Appwrite authentication service
 */

import { ID, Models } from 'appwrite';

import { account } from './config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export type AuthUser = Models.User<Models.Preferences>;

class AuthService {
  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const user = await account.get();
      return user as AuthUser;
    } catch (error) {
      if (import.meta.env.MODE === 'development') {
        // eslint-disable-next-line no-console
        console.log('No active session:', error);
      }
      return null;
    }
  }

  // Login with email and password
  async login({ email, password }: LoginCredentials): Promise<AuthUser> {
    try {
      await account.createEmailPasswordSession(email, password);
      const user = await this.getCurrentUser();
      if (!user) {
        throw new Error('Failed to get user after login');
      }
      return user;
    } catch (error) {
      if (import.meta.env.MODE === 'development') {
        // eslint-disable-next-line no-console
        console.error('Login error:', error);
      }
      throw new Error('Invalid email or password');
    }
  }

  // Register new user
  async register({ email, password, name }: RegisterData): Promise<AuthUser> {
    try {
      await account.create(ID.unique(), email, password, name);
      return await this.login({ email, password });
    } catch (error) {
      if (import.meta.env.MODE === 'development') {
        // eslint-disable-next-line no-console
        console.error('Registration error:', error);
      }
      throw new Error('Failed to create account. Email may already be in use.');
    }
  }

  // Login with Google OAuth
  async loginWithGoogle(): Promise<void> {
    try {
      account.createOAuth2Session(
        'google' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        `${window.location.origin}/auth/success`,
        `${window.location.origin}/auth/failure`
      );
    } catch (error) {
      if (import.meta.env.MODE === 'development') {
        // eslint-disable-next-line no-console
        console.error('Google OAuth error:', error);
      }
      throw new Error('Failed to authenticate with Google');
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await account.deleteSession('current');
    } catch (error) {
      if (import.meta.env.MODE === 'development') {
        // eslint-disable-next-line no-console
        console.error('Logout error:', error);
      }
      throw new Error('Failed to logout');
    }
  }

  // Get user sessions
  async getSessions() {
    try {
      return await account.listSessions();
    } catch (error) {
      if (import.meta.env.MODE === 'development') {
        // eslint-disable-next-line no-console
        console.error('Get sessions error:', error);
      }
      return null;
    }
  }

  // Send password recovery email
  async sendPasswordRecovery(email: string): Promise<void> {
    try {
      await account.createRecovery(
        email,
        `${window.location.origin}/auth/reset-password`
      );
    } catch (error) {
      if (import.meta.env.MODE === 'development') {
        // eslint-disable-next-line no-console
        console.error('Password recovery error:', error);
      }
      throw new Error('Failed to send recovery email');
    }
  }

  // Update password with recovery
  async updatePasswordRecovery(
    userId: string,
    secret: string,
    password: string
  ): Promise<void> {
    try {
      await account.updateRecovery(userId, secret, password);
    } catch (error) {
      if (import.meta.env.MODE === 'development') {
        // eslint-disable-next-line no-console
        console.error('Password update error:', error);
      }
      throw new Error('Failed to update password');
    }
  }

  // Update user preferences
  async updatePreferences(preferences: Record<string, unknown>): Promise<AuthUser> {
    try {
      const user = await account.updatePrefs(preferences);
      return user as AuthUser;
    } catch (error) {
      if (import.meta.env.MODE === 'development') {
        // eslint-disable-next-line no-console
        console.error('Update preferences error:', error);
      }
      throw new Error('Failed to update preferences');
    }
  }
}

export const authService = new AuthService();
export default authService;