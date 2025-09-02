import React from 'react';
import { createRoot } from 'react-dom/client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './src/app/App';
import { ErrorBoundary } from './src/components/common';
import './src/styles/index.css';

// Performance monitoring in production
if (import.meta.env.PROD) {
  // Add performance monitoring here
  // Example: import('./src/utils/analytics').then(({ initAnalytics }) => initAnalytics());
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!googleClientId) {
  throw new Error("Missing Google Client ID in environment variables");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
