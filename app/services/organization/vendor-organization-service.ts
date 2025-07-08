"use server";

import prisma from "@/lib/prisma";
import {
  CustomerProfileWithChargesAndSubs,
  includeCustomerProfileWithChargesAndSubs
} from "@/types/customer-profile";
import { OrganizationForStripeOps, includeOrgForStripeOps } from "@/types/organization";
import { ErrorMessageCode, HealthCheckResult } from "@/types/stripe";
import { checkVendorStripeStatusByOrgId } from "../stripe/stripe-vendor-service";
import { requireOrganization } from "../user-context-service";

/**
 * Vendor-specific organization operations
 * Used when the organization is acting as a VENDOR (selling products/services)
 * Includes Stripe account management, customer analytics, customer relationship management
 */

/**
 * Get the current organization as a vendor (includes Stripe details)
 */
export async function getCurrentVendorOrganization(): Promise<OrganizationForStripeOps> {
  const org = await requireOrganization();

  const vendorOrg = await prisma.organization.findUnique({
    where: { id: org.id },
    ...includeOrgForStripeOps
  });

  if (!vendorOrg) {
    throw new Error("Organization not found");
  }

  return vendorOrg as OrganizationForStripeOps;
}

/**
 * Get vendor organization by ID (includes Stripe details)
 */
export async function getVendorOrganizationById(
  id: string
): Promise<OrganizationForStripeOps | null> {
  const vendorOrg = await prisma.organization.findUnique({
    where: { id },
    ...includeOrgForStripeOps
  });

  return vendorOrg as OrganizationForStripeOps | null;
}

/**
 * Check if organization has Stripe account connected
 */
export async function hasConnectedStripeAccount(organizationId?: string): Promise<boolean> {
  const org = organizationId
    ? await getVendorOrganizationById(organizationId)
    : await getCurrentVendorOrganization();

  return !!org?.stripeAccountId;
}

/**
 * Get Stripe account health status for vendor organization
 */
export async function getVendorStripeStatus(organizationId?: string): Promise<HealthCheckResult> {
  const org = organizationId
    ? await getVendorOrganizationById(organizationId)
    : await getCurrentVendorOrganization();

  if (!org) {
    throw new Error("Organization not found");
  }

  if (!org.stripeAccountId) {
    return {
      canSell: false,
      messageCodes: [ErrorMessageCode.StripeAccountNotConnected],
      disabledReasons: []
    };
  }

  // Use the existing stripe vendor service, but pass the organization owner's ID
  // This maintains compatibility while we transition
  return await checkVendorStripeStatusByOrgId(org.id, true);
}

/**
 * Update vendor-specific Stripe data
 */
export async function updateVendorStripeData(
  organizationId: string,
  data: {
    stripeAccountId?: string | null;
    stripeCSRF?: string | null;
    stripeAccountDisabled?: boolean;
    stripeAccountDisabledReason?: string | null;
  }
): Promise<void> {
  await prisma.organization.update({
    where: { id: organizationId },
    data
  });
}

/**
 * Check if organization can sell (has Stripe account and it's enabled)
 */
export async function canOrganizationSell(organizationId?: string): Promise<boolean> {
  const status = await getVendorStripeStatus(organizationId);
  return status.canSell;
}

// ===== CUSTOMER RELATIONSHIP MANAGEMENT =====

/**
 * Get a specific customer profile by user ID for a vendor organization
 */
export async function getCustomerOfVendor(
  userId: string,
  vendorOrgId?: string
): Promise<CustomerProfileWithChargesAndSubs | null> {
  const vendorOrg = vendorOrgId
    ? await getVendorOrganizationById(vendorOrgId)
    : await getCurrentVendorOrganization();

  if (!vendorOrg) {
    throw new Error("Vendor organization not found");
  }

  return prisma.customerProfile.findFirst({
    where: {
      userId,
      OR: [
        {
          charges: {
            some: {
              tier: {
                organizationId: vendorOrg.id
              }
            }
          }
        },
        {
          subscriptions: {
            some: {
              tier: {
                organizationId: vendorOrg.id
              }
            }
          }
        }
      ]
    },
    ...includeCustomerProfileWithChargesAndSubs
  });
}

/**
 * Get all customer profiles for a vendor organization
 */
export async function getCustomersOfVendor(
  vendorOrgId?: string
): Promise<CustomerProfileWithChargesAndSubs[]> {
  const vendorOrg = vendorOrgId
    ? await getVendorOrganizationById(vendorOrgId)
    : await getCurrentVendorOrganization();

  if (!vendorOrg) {
    throw new Error("Vendor organization not found");
  }

  return prisma.customerProfile.findMany({
    where: {
      OR: [
        {
          charges: {
            some: {
              tier: {
                organizationId: vendorOrg.id
              }
            }
          }
        },
        {
          subscriptions: {
            some: {
              tier: {
                organizationId: vendorOrg.id
              }
            }
          }
        }
      ]
    },
    ...includeCustomerProfileWithChargesAndSubs
  });
}

/**
 * Get all customers for the current vendor organization
 */
export async function getCurrentVendorCustomers(): Promise<CustomerProfileWithChargesAndSubs[]> {
  return getCustomersOfVendor();
}

/**
 * Get prospects for a vendor organization
 */
export async function getProspectsOfVendor(vendorOrgId?: string) {
  const vendorOrg = vendorOrgId
    ? await getVendorOrganizationById(vendorOrgId)
    : await getCurrentVendorOrganization();

  if (!vendorOrg) {
    throw new Error("Vendor organization not found");
  }

  return prisma.prospect.findMany({
    where: {
      organizationId: vendorOrg.id
    },
    include: {
      tiers: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

/**
 * Get vendor analytics/stats including customer metrics
 */
export async function getVendorStats(organizationId?: string) {
  const org = organizationId
    ? await getVendorOrganizationById(organizationId)
    : await getCurrentVendorOrganization();

  if (!org) {
    throw new Error("Organization not found");
  }

  // Get aggregated stats for this vendor
  const stats = await prisma.organization.findUnique({
    where: { id: org.id },
    include: {
      _count: {
        select: {
          tiers: true,
          prospects: true
        }
      }
    }
  });

  if (!stats) {
    throw new Error("Organization not found");
  }

  // Get charges and subscriptions through customer profiles
  const charges = await prisma.charge.findMany({
    where: {
      tier: {
        organizationId: org.id
      }
    },
    include: {
      tier: true,
      customerProfile: {
        include: {
          user: true
        }
      }
    }
  });

  const subscriptions = await prisma.subscription.findMany({
    where: {
      tier: {
        organizationId: org.id
      }
    },
    include: {
      tier: true,
      customerProfile: {
        include: {
          user: true
        }
      }
    }
  });

  const totalRevenue = charges.reduce((sum, charge) => {
    return sum + (charge.tier.price || 0);
  }, 0);

  // Get unique customer count based on customer profiles
  const customers = await getCustomersOfVendor(org.id);

  return {
    totalTiers: stats._count.tiers,
    totalCharges: charges.length,
    totalSubscriptions: subscriptions.length,
    totalProspects: stats._count.prospects,
    totalCustomers: customers.length,
    totalRevenue: totalRevenue / 100, // Convert from cents to dollars
    recentCharges: charges.slice(0, 5) // Last 5 charges
  };
}
