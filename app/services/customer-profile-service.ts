"use server";

import { Prisma } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { includeCustomerProfileForCheckout } from "@/types/customer-profile";
import { StripeCard } from "@/types/stripe";
import {
  attachStripePaymentMethod,
  createStripeCustomer,
  createStripeSetupIntent,
  detachStripePaymentMethod,
  retrieveStripePaymentMethod
} from "./stripe/stripe-payment-service";
import { requireUser } from "./user-context-service";

/**
 * Customer profile operations
 * Manages user purchasing behavior, payment methods, and purchase history
 */

/**
 * Get the current user's customer profile
 */
export async function getCurrentCustomerProfile() {
  const user = await requireUser();

  let customerProfile = await prisma.customerProfile.findUnique({
    where: { userId: user.id },
    ...includeCustomerProfileForCheckout
  });

  if (!customerProfile) {
    customerProfile = await prisma.customerProfile.create({
      data: {
        userId: user.id,
        stripeCustomerIds: {},
        stripePaymentMethodIds: {}
      },
      ...includeCustomerProfileForCheckout
    });
  }

  return customerProfile;
}

/**
 * Get customer profile by user ID
 */
export async function getCustomerProfileById(userId: string) {
  let customerProfile = await prisma.customerProfile.findUnique({
    where: { userId },
    ...includeCustomerProfileForCheckout
  });

  if (!customerProfile) {
    customerProfile = await prisma.customerProfile.create({
      data: {
        userId,
        stripeCustomerIds: {},
        stripePaymentMethodIds: {}
      },
      ...includeCustomerProfileForCheckout
    });
  }

  return customerProfile;
}

/**
 * Update customer profile's Stripe data
 */
async function updateCustomerProfileStripeData(
  userId: string,
  data: {
    stripeCustomerIds?: Record<string, string>;
    stripePaymentMethodIds?: Record<string, string>;
  }
): Promise<void> {
  const updateData: Prisma.CustomerProfileUpdateInput = {};

  if (data.stripeCustomerIds) {
    updateData.stripeCustomerIds = data.stripeCustomerIds as Prisma.InputJsonValue;
  }

  if (data.stripePaymentMethodIds) {
    updateData.stripePaymentMethodIds = data.stripePaymentMethodIds as Prisma.InputJsonValue;
  }

  await prisma.customerProfile.upsert({
    where: { userId },
    update: updateData,
    create: {
      userId,
      stripeCustomerIds: data.stripeCustomerIds || {},
      stripePaymentMethodIds: data.stripePaymentMethodIds || {}
    }
  });
}

/**
 * Get Stripe Customer ID for a specific vendor
 */
export async function getStripeCustomerIdForVendor(
  vendorStripeAccountId: string,
  userId?: string
): Promise<string | null> {
  const customerProfile = userId
    ? await getCustomerProfileById(userId)
    : await getCurrentCustomerProfile();

  if (!customerProfile) return null;

  const customerIds = (customerProfile.stripeCustomerIds as Record<string, string>) || {};
  return customerIds[vendorStripeAccountId] || null;
}

/**
 * Get or create Stripe Customer ID for a specific vendor
 */
export async function getOrCreateStripeCustomerIdForVendor(
  vendorStripeAccountId: string,
  userId?: string
): Promise<string> {
  const customerProfile = userId
    ? await getCustomerProfileById(userId)
    : await getCurrentCustomerProfile();

  if (!customerProfile) {
    throw new Error("Customer profile not found");
  }

  let stripeCustomerId = await getStripeCustomerIdForVendor(
    vendorStripeAccountId,
    customerProfile.userId
  );

  if (stripeCustomerId) {
    return stripeCustomerId;
  }

  if (!customerProfile.user?.email) {
    throw new Error(`User does not have an email address, required for Stripe customer creation.`);
  }

  // Create customer using the stripe service
  const stripeCustomer = await createStripeCustomer(
    vendorStripeAccountId,
    customerProfile.user.email,
    customerProfile.user.name || `User ${customerProfile.userId}`
  );

  stripeCustomerId = stripeCustomer.id;

  // Update customer profile with new customer ID
  const existingCustomerIds = (customerProfile.stripeCustomerIds as Record<string, string>) || {};
  const updatedCustomerIds = {
    ...existingCustomerIds,
    [vendorStripeAccountId]: stripeCustomerId
  };

  await updateCustomerProfileStripeData(customerProfile.userId, {
    stripeCustomerIds: updatedCustomerIds
  });

  return stripeCustomerId;
}

/**
 * Get Stripe Payment Method ID for a specific vendor
 */
export async function getStripePaymentMethodIdForVendor(
  vendorStripeAccountId: string,
  userId?: string
): Promise<string | null> {
  const customerProfile = userId
    ? await getCustomerProfileById(userId)
    : await getCurrentCustomerProfile();

  if (!customerProfile) return null;

  const paymentMethodIds = (customerProfile.stripePaymentMethodIds as Record<string, string>) || {};
  return paymentMethodIds[vendorStripeAccountId] || null;
}

/**
 * Create setup intent for collecting payment method
 */
export async function createPaymentMethodSetupIntent(
  vendorStripeAccountId: string,
  userId?: string
): Promise<{ clientSecret: string | null; error: string | null }> {
  try {
    const stripeCustomerId = await getOrCreateStripeCustomerIdForVendor(
      vendorStripeAccountId,
      userId
    );

    const setupIntent = await createStripeSetupIntent(vendorStripeAccountId, stripeCustomerId);

    return { clientSecret: setupIntent.client_secret, error: null };
  } catch (error: unknown) {
    console.error("Error creating setup intent:", error);
    return {
      clientSecret: null,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}

/**
 * Attach payment method to customer profile for a specific vendor
 */
export async function attachPaymentMethodForVendor(
  vendorStripeAccountId: string,
  paymentMethodId: string,
  userId?: string
): Promise<void> {
  const customerProfile = userId
    ? await getCustomerProfileById(userId)
    : await getCurrentCustomerProfile();

  if (!customerProfile) {
    throw new Error("Customer profile not found");
  }

  const stripeCustomerId = await getOrCreateStripeCustomerIdForVendor(
    vendorStripeAccountId,
    customerProfile.userId
  );

  // Use stripe service to attach payment method
  await attachStripePaymentMethod(vendorStripeAccountId, paymentMethodId, stripeCustomerId);

  // Update customer profile
  const existingPaymentMethodIds =
    (customerProfile.stripePaymentMethodIds as Record<string, string>) || {};
  const updatedPaymentMethodIds = {
    ...existingPaymentMethodIds,
    [vendorStripeAccountId]: paymentMethodId
  };

  await updateCustomerProfileStripeData(customerProfile.userId, {
    stripePaymentMethodIds: updatedPaymentMethodIds
  });
}

/**
 * Detach payment method from customer profile for a specific vendor
 */
export async function detachPaymentMethodForVendor(
  vendorStripeAccountId: string,
  userId?: string
): Promise<void> {
  const customerProfile = userId
    ? await getCustomerProfileById(userId)
    : await getCurrentCustomerProfile();

  if (!customerProfile) {
    throw new Error("Customer profile not found");
  }

  const paymentMethodId = await getStripePaymentMethodIdForVendor(
    vendorStripeAccountId,
    customerProfile.userId
  );
  const stripeCustomerId = await getStripeCustomerIdForVendor(
    vendorStripeAccountId,
    customerProfile.userId
  );

  if (paymentMethodId && stripeCustomerId) {
    try {
      // Use stripe service to detach payment method
      await detachStripePaymentMethod(vendorStripeAccountId, paymentMethodId, stripeCustomerId);
    } catch (error: any) {
      if (error.code !== "resource_missing") {
        console.warn(
          `Could not detach payment method ${paymentMethodId} on Stripe for vendor ${vendorStripeAccountId}: ${error.message}`
        );
      }
    }
  }

  // Clear from customer profile
  const existingPaymentMethodIds =
    (customerProfile.stripePaymentMethodIds as Record<string, string>) || {};
  delete existingPaymentMethodIds[vendorStripeAccountId];

  await updateCustomerProfileStripeData(customerProfile.userId, {
    stripePaymentMethodIds: existingPaymentMethodIds
  });
}

/**
 * Get payment method details for a vendor
 */
export async function getPaymentMethodDetailsForVendor(
  vendorStripeAccountId: string,
  userId?: string
): Promise<StripeCard | null> {
  const paymentMethodId = await getStripePaymentMethodIdForVendor(vendorStripeAccountId, userId);

  if (!paymentMethodId) return null;

  try {
    const paymentMethod = await retrieveStripePaymentMethod(vendorStripeAccountId, paymentMethodId);

    if (paymentMethod.type === "card" && paymentMethod.card) {
      return {
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4
      };
    }
  } catch (error) {
    console.error(`Error retrieving payment method ${paymentMethodId} from Stripe:`, error);
    return null;
  }

  return null;
}

/**
 * Check if user can make payment to a specific vendor
 */
export async function canMakePaymentToVendor(
  vendorStripeAccountId: string,
  userId?: string
): Promise<boolean> {
  const stripeCustomerId = await getStripeCustomerIdForVendor(vendorStripeAccountId, userId);
  const paymentMethodId = await getStripePaymentMethodIdForVendor(vendorStripeAccountId, userId);
  return !!stripeCustomerId && !!paymentMethodId;
}

/**
 * Get purchase history for user
 */
export async function getPurchaseHistory(userId?: string) {
  const customerProfile = userId
    ? await getCustomerProfileById(userId)
    : await getCurrentCustomerProfile();

  if (!customerProfile) {
    throw new Error("Customer profile not found");
  }

  const [charges, subscriptions] = await Promise.all([
    prisma.charge.findMany({
      where: { customerProfileId: customerProfile.id },
      include: { tier: true },
      orderBy: { createdAt: "desc" },
      take: 10
    }),
    prisma.subscription.findMany({
      where: { customerProfileId: customerProfile.id },
      include: { tier: true },
      orderBy: { createdAt: "desc" },
      take: 10
    })
  ]);

  return {
    charges,
    subscriptions
  };
}
