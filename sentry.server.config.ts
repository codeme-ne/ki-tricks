/**
 * Sentry Server Configuration
 *
 * Monitors errors and performance on the server-side (API routes, SSR)
 */
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Only enable Sentry if DSN is configured
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment
  environment: process.env.NODE_ENV || 'development',

  // Capture request data (headers, IP)
  sendDefaultPii: true,

  // Enable logs to Sentry
  enableLogs: true,

  // Performance monitoring
  // 1.0 = 100% of transactions (adjust in production based on volume)
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Ignore common expected errors
  ignoreErrors: [
    // Browser errors that aren't actionable
    'Non-Error promise rejection captured',
    'Non-Error exception captured',
    // Network errors
    'NetworkError',
    'Network request failed',
    // Aborted requests (user canceled)
    'AbortError',
    'Request aborted',
  ],

  // Filter out noise from breadcrumbs
  beforeBreadcrumb(breadcrumb) {
    // Ignore console logs in production
    if (breadcrumb.category === 'console' && process.env.NODE_ENV === 'production') {
      return null;
    }
    return breadcrumb;
  },

  // Add custom context to every event
  beforeSend(event, hint) {
    // Add custom tags
    if (event.request?.url) {
      const url = new URL(event.request.url);
      event.tags = {
        ...event.tags,
        endpoint: url.pathname,
      };
    }

    return event;
  },
});