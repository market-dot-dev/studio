"use server";

import { Prisma, User } from "@/app/generated/prisma";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  includeOrgSwitcherContext,
  MinimalOrganization,
  OrganizationSwitcherContext
} from "@/types/organization";
import { SessionUser } from "@/types/session";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getOrganizationById } from "./organization/organization-service";

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

export const updateCurrentUser = async (userData: Prisma.UserUpdateInput) => {
  const userId = await requireUserId();
  const result = await prisma.user.update({
    where: { id: userId },
    data: userData
  });
  return result;
};

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
export const getCurrentOrganization = cache(async (): Promise<MinimalOrganization | null> => {
  const organizationId = await getCurrentOrganizationId();
  if (!organizationId) return null;

  return getOrganizationById(organizationId);
});

/**
 * Requires a valid organization, redirects if not present
 * @returns The complete organization object
 */
export const requireOrganization = cache(async (): Promise<MinimalOrganization> => {
  const user = await requireUser(); // Ensure user is authenticated first

  if (!user.currentOrganizationId) {
    redirect("/organizations");
  }

  const organization = await getOrganizationById(user.currentOrganizationId);

  if (!organization) {
    // This should rarely happen - only if org was deleted after being set as current
    redirect("/organizations");
  }

  return organization;
});

/**
 * Gets organization switcher context - current org + all available orgs in one efficient call
 * @returns Current organization and all available organizations with minimal data needed for switcher
 */
export const getOrganizationSwitcherContext = cache(
  async (): Promise<OrganizationSwitcherContext> => {
    const user = await requireUser();

    // Get all organization memberships with switcher data
    const memberships = await prisma.organizationMember.findMany({
      where: {
        userId: user.id
      },
      include: {
        organization: {
          ...includeOrgSwitcherContext
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const availableOrganizations = memberships.map((membership) => ({
      organization: membership.organization,
      role: membership.role,
      createdAt: membership.createdAt
    }));

    // Find current organization from the memberships
    const currentOrganization = user.currentOrganizationId
      ? availableOrganizations.find((org) => org.organization.id === user.currentOrganizationId)
          ?.organization || null
      : null;

    return {
      currentOrganization,
      availableOrganizations
    };
  }
);

/**
 * Set an organization as the current one for a user
 */
export async function setCurrentOrganization(organizationId: string): Promise<void> {
  const user = await requireUser();

  // Check if user is a member of the organization
  const membership = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId: user.id
      }
    }
  });

  if (!membership) {
    throw new Error("You are not a member of this organization");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      currentOrganizationId: organizationId
    }
  });
}
