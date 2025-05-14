import withBundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "market.local:3000",
        "*.market.local:3000",
        "*.gitwallet.co",
        "gitwallet.co",
        "market.dev",
        "*.market.dev",
        process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ? "*.vercel.app" : ""
      ].filter(Boolean)
    }
  },
  images: {
    remotePatterns: [
      { hostname: "zxtd3e8okojshxsg.public.blob.vercel-storage.com" }, // staging
      { hostname: "8wcbwvylaq3j2t5y.public.blob.vercel-storage.com" }, // production
      { hostname: "public.blob.vercel-storage.com" },
      { hostname: "res.cloudinary.com" },
      { hostname: "abs.twimg.com" },
      { hostname: "pbs.twimg.com" },
      { hostname: "avatar.vercel.sh" },
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "www.google.com" },
      { hostname: "flag.vercel.app" },
      { hostname: "illustrations.popsy.co" },
      { hostname: "www.gitwallet.co" },
      { hostname: "www.market.dev" },
      { hostname: "market.dev" }
    ]
  },
  logging: {
    fetches: {
      fullUrl: true
    }
  },

  // Redirect *.gitwallet.co -> *.market.dev
  async redirects() {
    return [
      {
        source: "/memo",
        destination: "https://marketdev.notion.site/memo",
        permanent: false
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "^(?<subdomain>.*)\\.gitwallet\\.co$"
          }
        ],
        destination: "https://:subdomain.market.dev/:path*",
        permanent: true
      }
    ];
  }
};

// Define Sentry configuration types
type SentryPluginOptions = {
  silent: boolean;
  org: string;
  project: string;
};

type SentryWebpackPluginOptions = {
  widenClientFileUpload: boolean;
  transpileClientSDK: boolean;
  tunnelRoute: string;
  hideSourceMaps: boolean;
  disableLogger: boolean;
  automaticVercelMonitors: boolean;
};

// Apply Sentry configuration conditionally based on environment
const config =
  process.env.NODE_ENV !== "development"
    ? withSentryConfig(nextConfig, {
        // For all available options, see:
        // https://github.com/getsentry/sentry-webpack-plugin#options

        org: "marketdotdev",
        project: "storedotdev",

        // Only print logs for uploading source maps in CI
        silent: !process.env.CI,

        // For all available options, see:
        // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

        // Upload a larger set of source maps for prettier stack traces (increases build time)
        widenClientFileUpload: true,

        // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
        // This can increase your server load as well as your hosting bill.
        // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
        // side errors will fail.
        tunnelRoute: "/error-monitoring",

        // Automatically tree-shake Sentry logger statements to reduce bundle size
        disableLogger: true,

        // Enables automatic instrumentation of Vercel Cron Monitors.
        // See the following for more information:
        // https://docs.sentry.io/product/crons/
        // https://vercel.com/docs/cron-jobs
        automaticVercelMonitors: true
      })
    : nextConfig;

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true"
})(config);
