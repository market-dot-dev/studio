"use server";

import { OrganizationBilling, Prisma, SubscriptionStatus } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { requireOrganization } from "../user-context-service";

/**
 * Get or create platform billing record for the current organization
 */
export async function getOrCreateBilling(): Promise<OrganizationBilling> {
  const org = await requireOrganization();

  let billing = await prisma.organizationBilling.findUnique({
    where: { organizationId: org.id }
  });

  if (!billing) {
    billing = await prisma.organizationBilling.create({
      data: {
        organizationId: org.id,
        subscriptionStatus: SubscriptionStatus.FREE_TRIAL
      }
    });
  }

  return billing;
}

/**
 * Get platform billing for current organization
 */
export async function getCurrentBilling(): Promise<OrganizationBilling | null> {
  const org = await requireOrganization();

  return prisma.organizationBilling.findUnique({
    where: { organizationId: org.id }
  });
}

/**
 * Get platform billing by Stripe customer ID
 */
export async function getBillingByStripeCustomerId(
  stripeCustomerId: string
): Promise<OrganizationBilling | null> {
  return prisma.organizationBilling.findUnique({
    where: { stripeCustomerId }
  });
}

/**
 * Update platform billing record
 */
export async function updateBilling(
  organizationId: string,
  data: Prisma.OrganizationBillingUpdateInput
): Promise<OrganizationBilling> {
  return prisma.organizationBilling.update({
    where: { organizationId },
    data
  });
}

/**
 * Update current organization's platform billing
 */
export async function updateCurrentBilling(
  data: Prisma.OrganizationBillingUpdateInput
): Promise<OrganizationBilling> {
  const org = await requireOrganization();
  return updateBilling(org.id, data);
}
