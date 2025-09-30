const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Enable experimental instrumentation hook
  experimental: {
    instrumentationHook: true,
  },
}

// Sentry configuration options
const sentryWebpackPluginOptions = {
  // Only upload source maps in production
  silent: process.env.NODE_ENV !== 'production',

  // Suppress all Sentry CLI logs
  hideSourceMaps: true,

  // Disable automatic upload in development
  disableServerWebpackPlugin: process.env.NODE_ENV !== 'production',
  disableClientWebpackPlugin: process.env.NODE_ENV !== 'production',

  // Upload source maps to Sentry (requires SENTRY_AUTH_TOKEN)
  widenClientFileUpload: true,
}

// Only wrap with Sentry config if DSN is provided
module.exports = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
  : nextConfig