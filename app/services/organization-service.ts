"use server";

import prisma from "@/lib/prisma";
import {
  FullOrganization,
  MinimalOrganization,
  includeFullOrg,
  includeMinimalOrg
} from "@/types/organization";
import { requireUser } from "./user-context-service";

/**
 * Basic Organization CRUD operations
 * Used for UI, session context, and general organization management
 * Does NOT include Stripe-specific details unless explicitly needed
 */

/**
 * Get an organization by ID with minimal data (for UI)
 */
export async function getOrganizationById(id: string): Promise<MinimalOrganization | null> {
  return prisma.organization.findUnique({
    where: { id },
    ...includeMinimalOrg
  });
}

/**
 * Get an organization by ID with full data (for admin/settings pages)
 */
export async function getFullOrganizationById(id: string): Promise<FullOrganization | null> {
  return prisma.organization.findUnique({
    where: { id },
    ...includeFullOrg
  });
}

/**
 * Get all organizations for the current user
 */
export async function getUserOrganizations(): Promise<
  Array<{
    organization: MinimalOrganization;
    role: string;
    createdAt: Date;
  }>
> {
  const user = await requireUser();

  const memberships = await prisma.organizationMember.findMany({
    where: {
      userId: user.id
    },
    include: {
      organization: {
        ...includeMinimalOrg
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return memberships.map((membership) => ({
    organization: membership.organization as MinimalOrganization,
    role: membership.role,
    createdAt: membership.createdAt
  }));
}

/**
 * Update basic organization information
 */
export async function updateOrganization(
  id: string,
  data: {
    name?: string;
    projectName?: string;
    projectDescription?: string;
    businessType?: string;
    businessLocation?: string;
    company?: string;
  }
): Promise<MinimalOrganization> {
  const updated = await prisma.organization.update({
    where: { id },
    data,
    ...includeMinimalOrg
  });

  return updated as MinimalOrganization;
}

/**
 * Check if user has permission to access organization
 */
export async function hasOrganizationAccess(organizationId: string): Promise<boolean> {
  const user = await requireUser();

  const membership = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId: user.id
      }
    }
  });

  return !!membership;
}

/**
 * Get organization members (for team management)
 */
export async function getOrganizationMembers(organizationId: string) {
  return prisma.organizationMember.findMany({
    where: { organizationId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: "asc"
    }
  });
}
