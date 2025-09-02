import { useState, useCallback } from 'react';

import type { Page } from '@/types';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<Page>('login');

  const handleLoginSuccess = useCallback(() => {
    setIsLoggedIn(true);
    setCurrentPage('app');
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setCurrentPage('login');
  }, []);

  const navigateTo = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  return {
    isLoggedIn,
    currentPage,
    handleLoginSuccess,
    handleLogout,
    navigateTo,
  };
};