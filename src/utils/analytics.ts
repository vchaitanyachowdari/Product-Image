import { env } from '@/src/config';

// Analytics utility for production monitoring
export const initAnalytics = () => {
  if (!env.ENABLE_ANALYTICS || !import.meta.env.PROD) {
    return;
  }

  // Initialize your analytics service here
  // Example: Google Analytics, Mixpanel, etc.
  console.log('Analytics initialized');
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (!env.ENABLE_ANALYTICS || !import.meta.env.PROD) {
    return;
  }

  // Track events
  console.log('Event tracked:', eventName, properties);
};

export const trackError = (error: Error, context?: Record<string, any>) => {
  if (!import.meta.env.PROD) {
    console.error('Error tracked:', error, context);
    return;
  }

  // Send error to monitoring service
  // Example: Sentry, LogRocket, etc.
};