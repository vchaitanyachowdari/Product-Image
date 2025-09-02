import React from 'react';
import ReactDOM from 'react-dom/client';
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

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
