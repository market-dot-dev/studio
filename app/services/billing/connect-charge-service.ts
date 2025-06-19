"use server";

import { Charge } from "@/app/generated/prisma";
import { getCustomerOrganizationById } from "@/app/services/organization/customer-organization-service";
import { getVendorOrganizationById } from "@/app/services/organization/vendor-organization-service";
import { calculatePlatformFee } from "@/app/services/stripe/stripe-price-service";
import { getTierByIdWithOrg } from "@/app/services/tier/tier-service";
import { requireOrganization } from "@/app/services/user-context-service";
import prisma from "@/lib/prisma";
import { confirmCustomerPurchase, notifyOwnerOfNewPurchase } from "../email-service";

/**
 * Find a charge by ID with organization and tier data
 */
export async function findCharge(chargeId: string): Promise<Charge | null> {
  return prisma.charge.findUnique({
    where: {
      id: chargeId
    },
    include: {
      organization: {
        include: {
          owner: true
        }
      },
      tier: true
    }
  });
}

/**
 * Count charges for a specific tier and revision
 */
export async function chargeCount(tierId: string, revision?: number): Promise<number> {
  return prisma.charge.count({
    where: {
      tierId: tierId,
      tierRevision: revision ? revision : undefined
    }
  });
}

/**
 * Check if a tier has any charges
 */
export async function hasCharges(tierId: string, revision?: number): Promise<boolean> {
  const charges = await prisma.charge.findMany({
    where: {
      tierId: tierId,
      tierRevision: revision ? revision : undefined
    }
  });

  return charges.length > 0;
}

/**
 * Check if any charges exist for a tier ID
 */
export async function anyChargesByTierId(tierId: string): Promise<boolean> {
  const charges = await findChargesByTierId(tierId);
  return charges.length > 0;
}

/**
 * Find charges by tier ID for the current organization
 */
export async function findChargesByTierId(tierId: string): Promise<Charge[]> {
  const org = await requireOrganization();
  return prisma.charge.findMany({
    where: {
      tierId,
      organizationId: org.id
    }
  });
}

/**
 * Find all charges for the current organization
 */
export async function getChargesForCurrentOrganization(): Promise<Charge[]> {
  const org = await requireOrganization();
  return prisma.charge.findMany({
    where: {
      organizationId: org.id
    }
  });
}

/**
 * Get charges for a specific organization
 */
export async function findChargesForOrganization(organizationId: string): Promise<Charge[]> {
  return prisma.charge.findMany({
    where: {
      organizationId: organizationId
    },
    include: {
      organization: {
        include: {
          owner: true
        }
      },
      tier: true
    }
  });
}

/**
 * Create a local charge record for an organization
 */
export async function createLocalCharge(
  customerOrgId: string,
  tierId: string,
  paymentIntentId: string,
  tierVersionId?: string
): Promise<Charge> {
  const customerOrg = await getCustomerOrganizationById(customerOrgId);
  if (!customerOrg) throw new Error("Customer organization not found");

  const tier = await getTierByIdWithOrg(tierId);
  if (!tier || !tier.organization || !tier.organization.stripeAccountId) {
    throw new Error("Tier not valid");
  }

  if (tier.cadence !== "once") throw new Error("Tier is not a one-time purchase");
  if (!tier.stripePriceId) throw new Error("Stripe price ID not found for tier");

  const vendorOrg = await getVendorOrganizationById(tier.organizationId);
  if (!vendorOrg || !vendorOrg.stripeAccountId) {
    throw new Error("Vendor organization not found or Stripe account not connected");
  }

  // Calculate platform fee amount for tracking
  const platformFeeAmount = calculatePlatformFee(
    tier.price || 0,
    vendorOrg.billing?.planType || null
  );

  const charge = await prisma.charge.create({
    data: {
      organizationId: customerOrgId,
      tierId: tierId,
      tierVersionId: tierVersionId,
      stripeChargeId: paymentIntentId,
      tierRevision: tier.revision,
      platformFeeAmount: platformFeeAmount
    }
  });

  await Promise.all([
    notifyOwnerOfNewPurchase(vendorOrg.owner.id, customerOrg.owner, tier.name),
    confirmCustomerPurchase(customerOrg.owner, tier.name)
  ]);

  return charge;
}
