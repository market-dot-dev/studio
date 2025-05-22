import { Prisma } from "@/app/generated/prisma";

/**
 * Prisma validator for minimal organization data
 */
export const includeMinimalOrg = Prisma.validator<Prisma.OrganizationDefaultArgs>()({
  select: {
    id: true,
    name: true,
    type: true,
    ownerId: true,
    createdAt: true,
    updatedAt: true,
    projectName: true,
    projectDescription: true,
    stripeAccountId: true,
    stripeAccountDisabled: true
  }
});

export type MinimalOrganization = Prisma.OrganizationGetPayload<typeof includeMinimalOrg>;

/**
 * Prisma validator for organization data needed during checkout and Stripe operations.
 * Includes owner's email, and Stripe JSON fields.
 */
export const includeOrgForStripeOps = Prisma.validator<Prisma.OrganizationDefaultArgs>()({
  select: {
    id: true,
    name: true,
    owner: {
      select: {
        id: true,
        email: true,
        name: true
      }
    },
    stripeCustomerIds: true,
    stripePaymentMethodIds: true,
    // Include other fields if necessary, e.g., stripeAccountId for vendor orgs
    stripeAccountId: true
  }
});

export type OrganizationForStripeOps = Prisma.OrganizationGetPayload<typeof includeOrgForStripeOps>;

/**
 * Prisma validator for full organization data
 */
export const includeFullOrg = Prisma.validator<Prisma.OrganizationDefaultArgs>()({
  include: {
    owner: {
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      }
    },
    members: {
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    },
    sites: {
      select: {
        id: true,
        name: true,
        subdomain: true,
        customDomain: true
      }
    },
    _count: {
      select: {
        tiers: true,
        charges: true,
        subscriptions: true,
        leads: true,
        prospects: true
      }
    }
  }
});

export type FullOrganization = Prisma.OrganizationGetPayload<typeof includeFullOrg>;
