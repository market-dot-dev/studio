import { Prisma } from "@/app/generated/prisma";

/**
 * Prisma validator for minimal organization data
 */
export const includeMinimalOrg = Prisma.validator<Prisma.OrganizationDefaultArgs>()({
  select: {
    id: true,
    name: true,
    type: true,
    description: true,
    businessLocation: true,
    businessType: true,
    owner: {
      select: {
        id: true,
        email: true,
        name: true
      }
    },
    sites: {
      select: {
        subdomain: true
      },
      take: 1,
      orderBy: {
        createdAt: "asc"
      }
    },
    createdAt: true,
    updatedAt: true,
    onboarding: true,
    stripeAccountId: true,
    stripeAccountDisabled: true
  }
});

export type MinimalOrganization = Prisma.OrganizationGetPayload<typeof includeMinimalOrg>;

/**
 * Prisma validator for organization switcher data (minimal org + first site)
 */
export const includeOrgSwitcherContext = Prisma.validator<Prisma.OrganizationDefaultArgs>()({
  select: {
    id: true,
    name: true,
    type: true,
    sites: {
      select: {
        subdomain: true
      },
      take: 1,
      orderBy: {
        createdAt: "asc"
      }
    },
    createdAt: true
  }
});

export type OrganizationForSwitcher = Prisma.OrganizationGetPayload<
  typeof includeOrgSwitcherContext
>;

/**
 * Prisma validator for organization data needed during checkout and Stripe operations.
 * Includes owner's email, Stripe JSON fields, and billing information.
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
    stripeCSRF: true,
    stripeAccountId: true,
    billing: {
      select: {
        planType: true
      }
    }
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
        prospects: true
      }
    }
  }
});

export type FullOrganization = Prisma.OrganizationGetPayload<typeof includeFullOrg>;

/**
 * Combined type for organization switcher context
 */
export interface OrganizationSwitcherContext {
  currentOrganization: OrganizationForSwitcher | null;
  availableOrganizations: Array<{
    organization: OrganizationForSwitcher;
    role: string;
    createdAt: Date;
  }>;
}

export interface CurrentOrganizationForSettings {
  id: string;
  name: string;
  description: string | null;
  businessType: string | null;
  businessLocation: string | null;
  subdomain: string | null;
}
