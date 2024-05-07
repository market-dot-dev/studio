/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    serverActions: {
      allowForwardedHosts: [
        "gitwallet.local:3000",
        "gitwallet.co",
        "*.gitwallet.local:3000",
        "*.gitwallet.co",
        "gitwallet.co",
        "gitwallet.local:3000",
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ? "*.vercel.app" : "",
      ].filter(Boolean),
      allowedOrigins: [
        "*.gitwallet.local:3000",
        "*.gitwallet.co",
        "gitwallet.co",
        "gitwallet.local:3000",
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ? "*.vercel.app" : "",
      ].filter(Boolean),
    },
  },
  images: {
    remotePatterns: [
      { hostname: "public.blob.vercel-storage.com" },
      { hostname: "res.cloudinary.com" },
      { hostname: "abs.twimg.com" },
      { hostname: "pbs.twimg.com" },
      { hostname: "avatar.vercel.sh" },
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "www.google.com" },
      { hostname: "flag.vercel.app" },
      { hostname: "illustrations.popsy.co" },
    ]
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};


// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

if (process.env.NODE_ENV !== 'development') { // Only enable Sentry for production builds
  module.exports = withSentryConfig(
    nextConfig,
    {
      // For all available options, see:
      // https://github.com/getsentry/sentry-webpack-plugin#options

      // Suppresses source map uploading logs during build
      silent: true,
      org: "gitwallet",
      project: "gitwallet-web",
    },
    {
      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Transpiles SDK to be compatible with IE11 (increases bundle size)
      transpileClientSDK: false,

      // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
      tunnelRoute: "/monitoring",

      // Hides source maps from generated client bundles
      hideSourceMaps: true,

      // Automatically tree-shake Sentry logger statements to reduce bundle size
      disableLogger: true,

      // Enables automatic instrumentation of Vercel Cron Monitors.
      // See the following for more information:
      // https://docs.sentry.io/product/crons/
      // https://vercel.com/docs/cron-jobs
      automaticVercelMonitors: true,
    }
  )
}
else {
  module.exports = nextConfig;
}
