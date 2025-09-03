
import { ID, OAuthProvider } from 'appwrite';
import { useState, useCallback, useEffect } from 'react';

import type { Page } from '@/types';

import { account } from '../services/appwrite';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  const checkSession = async () => {
    try {
      const session = await account.get();
      setUser(session);
      setIsLoggedIn(true);
      setCurrentPage('app');
    } catch {
      setUser(null);
      setIsLoggedIn(false);
      setCurrentPage('login');
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    await account.createEmailPasswordSession(email, password);
    await checkSession();
  };

  const loginWithGoogle = () => {
    account.createOAuth2Session(OAuthProvider.Google, window.location.href, window.location.href);
  };

  const logout = async () => {
    await account.deleteSession('current');
    await checkSession();
  };

  const register = async (email: string, password: string, name: string) => {
    await account.create(ID.unique(), email, password, name);
    await login(email, password);
  };

  const navigateTo = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  return {
    isLoggedIn,
    currentPage,
    user,
    login,
    loginWithGoogle,
    logout,
    register,
    navigateTo,
  };
};
