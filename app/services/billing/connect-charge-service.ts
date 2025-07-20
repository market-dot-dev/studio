"use server";

import { Charge } from "@/app/generated/prisma";
import { getVendorOrganizationById } from "@/app/services/organization/vendor-organization-service";
import { calculatePlatformFee } from "@/app/services/stripe/stripe-price-service";
import { getTierByIdWithOrg } from "@/app/services/tier/tier-service";
import { requireUser } from "@/app/services/user-context-service";
import prisma from "@/lib/prisma";
import { getCustomerProfileById } from "../customer-profile-service";
import { confirmCustomerPurchase, notifyOwnerOfNewPurchase } from "../email-service";

/**
 * Find a charge by ID with customer profile and tier data
 */
export async function findCharge(chargeId: string): Promise<Charge | null> {
  return prisma.charge.findUnique({
    where: {
      id: chargeId
    },
    include: {
      customerProfile: {
        include: {
          user: true
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
 * Find charges by tier ID for the current user
 */
export async function findChargesByTierId(tierId: string): Promise<Charge[]> {
  const user = await requireUser();
  const customerProfile = await getCustomerProfileById(user.id);

  return prisma.charge.findMany({
    where: {
      tierId,
      customerProfileId: customerProfile.id
    }
  });
}

/**
 * Find all charges for the current user
 */
export async function getChargesForCurrentUser(): Promise<Charge[]> {
  const user = await requireUser();
  const customerProfile = await getCustomerProfileById(user.id);

  return prisma.charge.findMany({
    where: {
      customerProfileId: customerProfile.id
    }
  });
}

/**
 * Get charges for a specific customer profile
 */
export async function findChargesForCustomerProfile(userId: string): Promise<Charge[]> {
  const customerProfile = await getCustomerProfileById(userId);

  return prisma.charge.findMany({
    where: {
      customerProfileId: customerProfile.id
    },
    include: {
      customerProfile: {
        include: {
          user: true
        }
      },
      tier: true
    }
  });
}

/**
 * Create a local charge record for a user
 */
export async function createLocalCharge(
  userId: string,
  tierId: string,
  paymentIntentId: string,
  tierVersionId?: string
): Promise<Charge> {
  const customerProfile = await getCustomerProfileById(userId);
  if (!customerProfile) throw new Error("Customer profile not found");

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
  const platformFeeAmount = await calculatePlatformFee(
    tier.price || 0,
    vendorOrg.billing?.planType || null
  );

  const charge = await prisma.charge.create({
    data: {
      customerProfileId: customerProfile.id,
      tierId: tierId,
      tierVersionId: tierVersionId,
      stripeChargeId: paymentIntentId,
      tierRevision: tier.revision,
      platformFeeAmount: platformFeeAmount
    }
  });

  await Promise.all([
    notifyOwnerOfNewPurchase(vendorOrg.owner.id, customerProfile.user, tier.name),
    confirmCustomerPurchase(customerProfile.user, tier.name)
  ]);

  return charge;
}
