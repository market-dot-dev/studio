"use server";

import {
  attachPaymentMethod,
  canBuy,
  createSetupIntent,
  detachPaymentMethod,
  getPaymentMethod
} from "@/app/services/StripeService";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { includeVendorProfile, VendorProfile } from "@/types/checkout";
import { Contract, Tier } from "@prisma/client";

interface CheckoutData {
  tier: Tier | null;
  contract: Contract | null;
  vendor: VendorProfile | null;
  currentUser: {
    id: string;
    name?: string | null;
    email?: string | null;
  } | null;
  isAnnual: boolean;
}

export async function getCheckoutData(
  tierId: string,
  isAnnual: boolean = false
): Promise<CheckoutData> {
  // @TODO: Should we even be fetching this here?
  // Get current user directly from session - no DB lookup needed
  const session = await getSession();
  const currentUser = session?.user
    ? {
        id: session.user.id,
        name: session.user.name || null,
        email: session.user.email || null
      }
    : null;

  // Fetch tier data
  const tier = await prisma.tier.findUnique({
    where: { id: tierId }
  });

  if (!tier) {
    return { tier: null, contract: null, vendor: null, currentUser, isAnnual };
  }

  // Fetch vendor with minimal data
  const vendor = tier.userId
    ? await prisma.user.findUnique({
        where: { id: tier.userId },
        ...includeVendorProfile
      })
    : null;

  // Fetch contract if needed
  const contract = tier.contractId
    ? await prisma.contract.findUnique({ where: { id: tier.contractId } })
    : null;

  return {
    tier,
    contract,
    vendor,
    currentUser,
    isAnnual
  };
}

export async function getShortenedCadence(cadence: string | undefined) {
  if (cadence === "month") return "mo";
  if (cadence === "year") return "yr";
  return cadence;
}

// Get the user's payment method for a specific vendor
export async function getUserPaymentMethod(vendorUserId: string, vendorStripeAccountId: string) {
  try {
    const session = await getSession();
    if (!session?.user?.id) return null;

    // First check if the user has a payment method
    const canUserBuy = await canBuy(vendorUserId, vendorStripeAccountId);
    if (!canUserBuy) return null;

    // Get the payment method details
    return await getPaymentMethod(vendorUserId, vendorStripeAccountId);
  } catch (error) {
    console.error("Error getting payment method:", error);
    return null;
  }
}

// Create a setup intent for adding a new payment method
export async function createUserSetupIntent(vendorUserId: string, vendorStripeAccountId: string) {
  try {
    return await createSetupIntent(vendorUserId, vendorStripeAccountId);
  } catch (error) {
    console.error("Error creating setup intent:", error);
    return { clientSecret: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Add a new payment method
export async function addUserPaymentMethod(
  paymentMethodId: string,
  vendorUserId: string,
  vendorStripeAccountId: string
) {
  try {
    await attachPaymentMethod(paymentMethodId, vendorUserId, vendorStripeAccountId);
    return { success: true, error: null };
  } catch (error) {
    console.error("Error attaching payment method:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add payment method"
    };
  }
}

// Remove an existing payment method
export async function removeUserPaymentMethod(vendorUserId: string, vendorStripeAccountId: string) {
  try {
    await detachPaymentMethod(vendorUserId, vendorStripeAccountId);
    return { success: true };
  } catch (error) {
    console.error("Error detaching payment method:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove payment method"
    };
  }
}
