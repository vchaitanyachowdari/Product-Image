import { env } from '@/src/config';

// Analytics utility for production monitoring
export const initAnalytics = () => {
  if (!env.ENABLE_ANALYTICS || !import.meta.env.PROD) {
    return;
  }

  // Initialize your analytics service here
  // Example: Google Analytics, Mixpanel, etc.
  if (import.meta.env.MODE === 'development') {
    // eslint-disable-next-line no-console
    console.log('Analytics initialized');
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!env.ENABLE_ANALYTICS || !import.meta.env.PROD) {
    return;
  }

  // Track events
  if (import.meta.env.MODE === 'development') {
    // eslint-disable-next-line no-console
    console.log('Event tracked:', eventName, properties);
  }
};

export const trackError = (error: Error, context?: Record<string, any>) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!import.meta.env.PROD) {
    if (import.meta.env.MODE === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error tracked:', error, context);
    }
    return;
  }

  // Send error to monitoring service
  // Example: Sentry, LogRocket, etc.
};