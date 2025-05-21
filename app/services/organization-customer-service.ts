"use server";

import prisma from "@/lib/prisma";
import {
  CustomerOrgWithAll,
  CustomerOrgWithChargesAndSubs,
  includeCustomerOrgWithAll,
  includeCustomerOrgWithChargesAndSubs
} from "@/types/organization-customer";
import { User } from "../generated/prisma";
import { SessionUser } from "../models/Session";
import { requireOrganization } from "./user-context-service";

/**
 * Get a specific customer organization by vendor organization ID and customer organization ID
 */
export async function getCustomerOfOrganization(
  vendorOrgId: string,
  customerOrgId: string
): Promise<CustomerOrgWithChargesAndSubs | null> {
  return prisma.organization.findFirst({
    where: {
      id: customerOrgId,
      OR: [
        {
          charges: {
            some: {
              tier: {
                organizationId: vendorOrgId
              }
            }
          }
        },
        {
          subscriptions: {
            some: {
              tier: {
                organizationId: vendorOrgId
              }
            }
          }
        }
      ]
    },
    ...includeCustomerOrgWithChargesAndSubs
  });
}

/**
 * Get all customer organizations for a vendor organization
 */
export async function getCustomersOfOrganization(
  vendorOrgId: string
): Promise<CustomerOrgWithChargesAndSubs[]> {
  return prisma.organization.findMany({
    where: {
      OR: [
        {
          charges: {
            some: {
              tier: {
                organizationId: vendorOrgId
              }
            }
          }
        },
        {
          subscriptions: {
            some: {
              tier: {
                organizationId: vendorOrgId
              }
            }
          }
        }
      ]
    },
    ...includeCustomerOrgWithChargesAndSubs
  });
}

/**
 * Get all customers and prospects for a vendor organization
 */
export async function getCustomersAndProspectsByOrganization(
  vendorOrgId: string
): Promise<CustomerOrgWithAll[]> {
  return prisma.organization.findMany({
    where: {
      OR: [
        {
          charges: {
            some: {
              tier: {
                organizationId: vendorOrgId
              }
            }
          }
        },
        {
          subscriptions: {
            some: {
              tier: {
                organizationId: vendorOrgId
              }
            }
          }
        },
        {
          prospects: {
            some: {
              tiers: {
                some: {
                  organizationId: vendorOrgId
                }
              }
            }
          }
        }
      ]
    },
    ...includeCustomerOrgWithAll
  });
}

/**
 * Get all customers for the current organization
 */
export async function getCurrentOrganizationCustomers(): Promise<CustomerOrgWithChargesAndSubs[]> {
  const organization = await requireOrganization();
  return getCustomersOfOrganization(organization.id);
}

/**
 * @deprecated This file currently uses a "User" object but must be updated to Organization. See correct method below when ready.
 *
 * Get Stripe customer ID for a specific maintainer's account
 *
 * @param user The user to get the customer ID for
 * @param maintainerStripeAccountId The Stripe account ID of the maintainer
 * @returns The Stripe customer ID or null if not found
 */
export async function getStripeCustomerId(
  user: User | SessionUser,
  maintainerStripeAccountId: string
): Promise<string | null> {
  if (!user || !maintainerStripeAccountId) return null;

  const stripeCustomerIds = user.stripeCustomerIds as Record<string, string>;
  return stripeCustomerIds[maintainerStripeAccountId] || null;
}

// @NOTE: New version below using orgs
// /**
//  * Get Stripe customer ID for a specific vendor's account
//  */
// export async function getStripeCustomerId(
//   customerOrg: Organization,
//   vendorStripeAccountId: string
// ): Promise<string | null> {
//   if (!customerOrg || !vendorStripeAccountId) return null;

//   const stripeCustomerIds = customerOrg.stripeCustomerIds as Record<string, string>;
//   return stripeCustomerIds ? stripeCustomerIds[vendorStripeAccountId] || null : null;
// }
