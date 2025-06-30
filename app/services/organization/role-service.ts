"use server";

import { OrganizationRole, OrganizationType } from "@/app/generated/prisma";

/**
 * Authentication context for the current user
 */
export type AuthContext = {
  isAuthenticated: boolean;
  organizationType?: OrganizationType;
  userRole?: OrganizationRole;
};

/**
 * Paths that are publicly accessible without authentication
 */
const publicPaths = [
  /^\/$/,
  /^\/alpha$/,
  /^\/embed\//,
  /^\/api\/og\//,
  /^\/api\/users\/verify/,
  /^\/api\/tiers\//,
  /^\/terms/,
  /^\/privacy/,
  /^\/home$/,
  /^\/design/,
  /^\/login\/email$/,
  /^\/login\/pending$/,
  /^\/login$/,
  /^\/legal/,
  /^\/customer-login$/,
  /^\/login\/local-auth$/,
  /\/checkout\/[A-Za-z0-9]+/,
  /\/c\/contracts\/[A-Za-z0-9]+/, // Public contract views

  // Explore redirects
  /^\/ecosystems(\/|$)/,
  /^\/experts(\/|$)/,
  /^\/projects(\/|$)/,
  /^\/events(\/|$)/,
  /^\/organizations(\/|$)/,
  /^\/trending(\/|$)/,

  // Vendor public sites
  /^\/maintainer-site\//,

  // Auth flows
  /^\/app\/customer-login$/,
  /^\/app\/login$/,
  /^\/app\/login\/email$/,
  /^\/app\/login\/pending$/,
  /^\/app\/login\/error$/,
  /^\/app\/login\/local-auth$/
];

/**
 * Check if path is publicly accessible
 */
export async function isPublicPath(path: string): Promise<boolean> {
  return publicPaths.some((regex) => regex.test(path));
}

/**
 * Check if user can view a specific path
 */
export async function canViewPath(
  path: string,
  authContext: AuthContext,
  subdomain?: string
): Promise<boolean> {
  // Public paths are always accessible regardless of subdomain
  if (await isPublicPath(path)) {
    return true;
  }

  // Must be authenticated for all other paths
  if (!authContext.isAuthenticated) {
    return false;
  }

  // If we're on the app subdomain, apply org-specific rules
  if (subdomain === "app") {
    // Customer paths (/c and /c/*) - both CUSTOMER and VENDOR orgs can access
    if (path === "/c" || path.startsWith("/c/")) {
      return (
        authContext.organizationType === OrganizationType.CUSTOMER ||
        authContext.organizationType === OrganizationType.VENDOR
      );
    }

    // Payment flows - any authenticated user can access
    if (path.startsWith("/checkout/") || path === "/success") {
      return true;
    }

    // All other app subdomain paths require VENDOR org
    return authContext.organizationType === OrganizationType.VENDOR;
  }

  // For all other subdomains, authenticated users can access
  return true;
}

/**
 * Helper to create AuthContext from session data
 */
export async function createAuthContext(
  isAuthenticated: boolean,
  organizationType?: OrganizationType,
  userRole?: OrganizationRole
): Promise<AuthContext> {
  return {
    isAuthenticated,
    organizationType,
    userRole
  };
}

/**
 * Check if user has vendor permissions (for UI/feature gating)
 */
export async function hasVendorAccess(authContext: AuthContext): Promise<boolean> {
  return authContext.isAuthenticated && authContext.organizationType === OrganizationType.VENDOR;
}

/**
 * Check if user has customer permissions (for UI/feature gating)
 */
export async function hasCustomerAccess(authContext: AuthContext): Promise<boolean> {
  return (
    authContext.isAuthenticated &&
    (authContext.organizationType === OrganizationType.CUSTOMER ||
      authContext.organizationType === OrganizationType.VENDOR)
  );
}

/**
 * Check if user has admin permissions within their organization
 */
export async function hasOrgAdminAccess(authContext: AuthContext): Promise<boolean> {
  return (
    authContext.isAuthenticated &&
    (authContext.userRole === OrganizationRole.OWNER ||
      authContext.userRole === OrganizationRole.ADMIN)
  );
}
