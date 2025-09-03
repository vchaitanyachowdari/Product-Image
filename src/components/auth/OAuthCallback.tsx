/**
 * OAuth callback handler component
 */

import React, { useEffect } from 'react';

import { useAppwriteAuth } from '@/src/hooks/useAppwriteAuth';

interface OAuthCallbackProps {
  type: 'success' | 'failure';
  onSuccess?: () => void;
  onFailure?: () => void;
}

export const OAuthCallback: React.FC<OAuthCallbackProps> = ({
  type,
  onSuccess,
  onFailure,
}) => {
  const { isAuthenticated, error } = useAppwriteAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (type === 'success' && isAuthenticated) {
        onSuccess?.();
      } else if (type === 'failure' || error) {
        onFailure?.();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [type, isAuthenticated, error, onSuccess, onFailure]);

  if (type === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Authentication Successful
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              You have been successfully logged in. Redirecting...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Failed
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            There was an error during authentication. Redirecting to login...
          </p>
          {error && (
            <p className="mt-2 text-center text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      </div>
    </div>
  );
};