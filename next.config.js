/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  experimental: {
    serverActions: {
      allowForwardedHosts: ["gitwallet.local:3000", "gitwallet.co", "*.gitwallet.local:3000", "*.gitwallet.co", "gitwallet.co", "gitwallet.local:3000"],
      allowedOrigins: ["*.gitwallet.local:3000", "*.gitwallet.co", "gitwallet.co", "gitwallet.local:3000"],
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
};
