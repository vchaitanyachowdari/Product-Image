import React, { useState } from 'react';

import { Link, useRouter } from '@/src/components/routing/Router';
import { APP_CONFIG } from '@/src/config';
import type { AuthUser } from '@/src/services/appwrite/auth';

interface HeaderProps {
  isLoggedIn: boolean;
  user?: AuthUser | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isLoggedIn,
  user,
  onLogout,
}) => {
  const { currentPath } = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin = user?.labels?.includes('admin') || false;
  const navigationItems = [
    ...(isLoggedIn ? [
      { path: '/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/generate', label: 'Generate', icon: '🎨' },
      { path: '/search', label: 'Discover', icon: '🔍' },
    ] : [
      { path: '/search', label: 'Discover', icon: '🔍' },
    ]),
    ...(isAdmin ? [{ path: '/admin', label: 'Admin', icon: '⚙️' }] : []),
  ];

  return (
    <header className='bg-white shadow-sm sticky top-0 z-40'>
      <div className='container mx-auto px-4 md:px-8 py-4'>
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <Link to="/" className='flex items-center space-x-3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-8 w-8 text-blue-600'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
              />
            </svg>
            <h1 className='text-2xl font-bold text-slate-800'>
              {APP_CONFIG.name}
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-6'>
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPath === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className='flex items-center space-x-4'>
            {isLoggedIn ? (
              <div className='flex items-center space-x-4'>
                {user && (
                  <div className='flex items-center space-x-2'>
                    <div className='h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center'>
                      <span className='text-sm font-medium text-blue-600'>
                        {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className='text-sm text-gray-700 hidden sm:inline'>
                      {user.name || user.email}
                    </span>
                  </div>
                )}
                <button
                  onClick={onLogout}
                  className='bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  aria-label="Logout"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className='flex items-center space-x-4'>
                <Link
                  to="/login"
                  className='font-semibold text-slate-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1'
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className='bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              aria-label="Toggle menu"
            >
              <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                {isMenuOpen ? (
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                ) : (
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className='md:hidden mt-4 pb-4 border-t border-gray-200'>
            <nav className='flex flex-col space-y-2 pt-4'>
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPath === item.path
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};