"use server";

import { Organization, User } from "@/app/generated/prisma";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cache } from "react";
import { SessionUser } from "../models/Session";

// Session-only functions (no DB queries)

/**
 * Gets the current user session without database queries
 * @returns The session user or null if not authenticated
 */
export const getCurrentUserSession = cache(async (): Promise<SessionUser | null> => {
  const session = await getSession();
  return session?.user || null;
});

/**
 * Requires a valid user session, redirects if not present
 * @returns The session user
 */
export const requireUserSession = cache(async (): Promise<SessionUser> => {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/api/auth/server-signout/");
  }
  return session.user;
});

/**
 * Gets the current user's ID from session
 * @returns User ID or null if not authenticated
 */
export const getCurrentUserId = cache(async (): Promise<string | null> => {
  const session = await getCurrentUserSession();
  return session?.id || null;
});

/**
 * Requires a valid user ID, redirects if not present
 * @returns User ID
 */
export const requireUserId = cache(async (): Promise<string> => {
  const session = await requireUserSession();
  return session.id;
});

// Full user functions (with DB queries)

/**
 * Gets the current user with database query
 * @returns The complete user object or null if not authenticated
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId }
  });
});

/**
 * Requires a valid user with database query, redirects if not present
 * @returns The complete user object
 */
export const requireUser = cache(async (): Promise<User> => {
  const userId = await requireUserId();

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    // This should rarely happen - only if user was deleted after session was created
    redirect("/api/auth/server-signout/");
  }

  return user;
});

// Organization functions

/**
 * Gets the current organization ID
 * @returns Organization ID or null if not available
 */
export const getCurrentOrganizationId = cache(async (): Promise<string | null> => {
  const user = await getCurrentUser();
  return user?.currentOrganizationId || null;
});

/**
 * Gets the current organization
 * @returns The complete organization object or null if not available
 */
export const getCurrentOrganization = cache(async (): Promise<Organization | null> => {
  const organizationId = await getCurrentOrganizationId();
  if (!organizationId) return null;

  return prisma.organization.findUnique({
    where: { id: organizationId }
    // @TODO: Select smaller object here
  });
});

/**
 * Requires a valid organization, redirects if not present
 * @returns The complete organization object
 */
export const requireOrganization = cache(async (): Promise<Organization> => {
  const user = await requireUser(); // Ensure user is authenticated first

  if (!user.currentOrganizationId) {
    redirect("/select-organization");
  }

  const organization = await prisma.organization.findUnique({
    where: { id: user.currentOrganizationId }
    // @TODO: Select smaller object here
  });

  if (!organization) {
    // This should rarely happen - only if org was deleted after being set as current
    redirect("/select-organization");
  }

  return organization;
});
