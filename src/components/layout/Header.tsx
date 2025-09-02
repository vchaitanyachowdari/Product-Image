import React from 'react';

import { APP_CONFIG } from '@/src/config';
import type { Page } from '@/types';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onNavigate: (page: Page) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isLoggedIn,
  onLogout,
  onNavigate,
}) => {
  return (
    <header className='bg-white shadow-sm sticky top-0 z-40'>
      <div className='container mx-auto px-4 md:px-8 py-4 flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
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
              d='M12 18v3m-3-3v3m6-3v3m-9-6.158a3.301 3.301 0 01.658-1.707l.2-.293a3.301 3.301 0 014.284 0l.2.293a3.301 3.301 0 01.658 1.707V12a3.301 3.301 0 01-5.3 2.493l-.293-.17a3.301 3.301 0 01-1.2-2.152V11.842zM12 3v2m-3.293 1.707L7 5.001M17 7.001l-1.707-1.294'
            />
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 21a9 9 0 110-18 9 9 0 010 18z'
            />
          </svg>
          <h1 className='text-2xl font-bold text-slate-800'>
            {APP_CONFIG.name}
          </h1>
        </div>
        <nav>
          {isLoggedIn ? (
            <button
              onClick={onLogout}
              className='bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              aria-label="Logout"
            >
              Logout
            </button>
          ) : (
            <div className='space-x-4'>
              <button
                onClick={() => onNavigate('login')}
                className='font-semibold text-slate-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1'
              >
                Login
              </button>
              <button
                onClick={() => onNavigate('register')}
                className='bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              >
                Sign Up
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};