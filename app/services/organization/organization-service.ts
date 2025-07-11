"use server";

import { businessDescription } from "@/lib/constants/site-template";
import prisma from "@/lib/prisma";
import {
  type CurrentOrganizationForSettings,
  FullOrganization,
  MinimalOrganization,
  includeFullOrg,
  includeMinimalOrg
} from "@/types/organization";
import { PlanType, Prisma } from "app/generated/prisma";
import { sendWelcomeEmailToMaintainer } from "../email-service";
import { createSite } from "../site/site-crud-service";
import { requireOrganization, requireUser } from "../user-context-service";

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
  data: Prisma.OrganizationUpdateInput
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

/**
 * Update current organization's business information
 */
export async function updateCurrentOrganizationBusiness(
  data: Prisma.OrganizationUpdateInput
): Promise<void> {
  const org = await requireOrganization();
  await updateOrganization(org.id, data);
}

/**
 * Get current organization for settings display
 * Returns organization with business fields needed for forms
 */
export async function getCurrentOrganizationForSettings(): Promise<CurrentOrganizationForSettings> {
  const org = await requireOrganization();
  return {
    id: org.id,
    name: org.name,
    description: org.description,
    businessType: org.businessType,
    businessLocation: org.businessLocation,
    subdomain: org.sites[0]?.subdomain ?? null
  };
}

/**
 * Get organization with integration status
 */
export async function getOrganizationWithIntegrations(id?: string) {
  const org = id ? { id } : await requireOrganization();

  return prisma.organization.findUnique({
    where: { id: org.id },
    include: {
      ...includeFullOrg.include,
      integrations: {
        include: {
          installedByUser: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          installedAt: "desc"
        }
      }
    }
  });
}

/**
 * Creates a new organization for a user, sets it as their current org,
 * and performs all related setup tasks like creating a site and sending a welcome email.
 * @param userId - The ID of the user who will own the new organization.
 * @param orgName - The desired name for the new organization.
 * @returns The newly created organization.
 */
export async function createVendorOrganizationForUser(userId: string, orgName: string) {
  // @TODO: Could potentially use session here instead
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }

  const organization = await prisma.organization.create({
    data: {
      name: orgName,
      ownerId: user.id,
      description: businessDescription,
      members: {
        create: {
          userId: user.id,
          role: "OWNER"
        }
      },
      billing: {
        create: {
          planType: PlanType.FREE
        }
      }
    }
  });

  // Update the user to make this their current organization
  await prisma.user.update({
    where: { id: user.id },
    data: {
      currentOrganizationId: organization.id
    }
  });

  // Perform post-creation setup
  await createSite(organization.id);
  await sendWelcomeEmailToMaintainer({ ...user });

  return organization;
}
