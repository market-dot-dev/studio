"use server";

/**
 * This service defines which URL paths in the application are considered "public".
 * Public paths can be accessed by anyone, regardless of their authentication status.
 * This is primarily used by the middleware to bypass authentication checks.
 * @NOTE: These must be specified with their prefix, like /app, to properly use the repo routes.
 */

const publicPaths = [
  // Root and marketing pages
  /^\/$/,
  /^\/home$/, // Public landing page

  // Static/metadata pages (part of landing page)
  /^\/terms/,
  /^\/privacy/,

  // Core authentication flow (bare domain)
  /^\/login$/,
  /^\/login\/email$/,
  /^\/login\/pending$/,
  /^\/login\/error$/,

  // Public-facing API routes
  /^\/api\/og\//, // Open Graph image generation
  /^\/api\/tiers\//, // Public tier information

  // Public purchasing and content views
  /^\/checkout\/[A-Za-z0-9]+/, // Direct checkout links are public until login is required
  /^\/c\/contracts\/[A-Za-z0-9]+/, // Public contract views

  // Embedded content
  /^\/embed\//,

  // Explore redirects
  /^\/ecosystems(\/|$)/,
  /^\/experts(\/|$)/,
  /^\/projects(\/|$)/,
  /^\/events(\/|$)/,
  /^\/organizations(\/|$)/,
  /^\/trending(\/|$)/,

  // Vendor public sites (handled by domain routing, but good to have as a fallback)
  /^\/maintainer-site\//,

  // Auth flows that happen within the /app directory structure but are public
  /^\/app\/login$/,
  /^\/app\/login\/email$/,
  /^\/app\/login\/pending$/,
  /^\/app\/login\/error$/
];

/**
 * Checks if a given path is public.
 * @param path - The URL path to check (e.g., /login, /app/tiers).
 * @returns True if the path is public, false otherwise.
 */
export async function isPublicPath(path: string): Promise<boolean> {
  return publicPaths.some((regex) => regex.test(path));
}

/**
 * Paths that should be rewritten to the /home directory on the bare domain
 */
const homePagePaths = ["/", "/terms", "/privacy"];

/**
 * Checks if a path should be handled by the home directory
 * @param path - The URL path to check
 * @returns True if the path should be rewritten to /home
 */
export async function isHomePagePath(path: string): Promise<boolean> {
  return homePagePaths.includes(path);
}
