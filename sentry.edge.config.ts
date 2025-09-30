/**
 * Sentry Edge Configuration
 *
 * Monitors errors in Edge Runtime (middleware)
 */
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Only enable Sentry if DSN is configured
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment
  environment: process.env.NODE_ENV || 'development',

  // Performance monitoring (lower sample rate for edge due to high volume)
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.05 : 1.0,

  // Edge-specific: ignore expected errors
  ignoreErrors: [
    'Rate limit exceeded', // Expected from our rate limiting
    'Too many requests',
  ],
});