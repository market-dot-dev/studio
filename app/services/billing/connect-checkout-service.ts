"use server";

import { PlanType } from "@/app/generated/prisma";
import { createSubscription } from "@/app/services/billing/connect-subscription-service";
import {
  getCurrentCustomerProfile,
  getOrCreateStripeCustomerIdForVendor,
  getStripePaymentMethodIdForVendor
} from "@/app/services/customer-profile-service";
import { getVendorOrganizationById } from "@/app/services/organization/vendor-organization-service";
import { createStripeCharge } from "@/app/services/stripe/stripe-payment-service";
import {
  createStripeSubscriptionForCustomer,
  isSubscribedToStripeTier
} from "@/app/services/stripe/stripe-subscription-service";
import { getTierById, getTierByIdForCheckout } from "@/app/services/tier/tier-service";
import { getCurrentUserSession, requireUser } from "@/app/services/user-context-service";
import { createLocalCharge } from "./connect-charge-service";

interface CheckoutData {
  tier: Awaited<ReturnType<typeof getTierByIdForCheckout>>;
  customerProfile: Awaited<ReturnType<typeof getCurrentCustomerProfile>> | null;
  isAnnual: boolean;
}

/**
 * Get all data needed for the checkout page
 */
export async function getCheckoutData(
  tierId: string,
  isAnnual: boolean = false
): Promise<CheckoutData> {
  const user = await getCurrentUserSession();

  // Get customer profile if user is logged in
  const customerProfile = user ? await getCurrentCustomerProfile() : null;

  // Get tier with vendor details included
  const tier = await getTierByIdForCheckout(tierId);

  return {
    tier,
    customerProfile,
    isAnnual
  };
}

/**
 * Utility function for UI display
 */
export async function getShortenedCadence(cadence: string | undefined) {
  if (cadence === "month") return "mo";
  if (cadence === "year") return "yr";
  return cadence;
}

/**
 * Process a payment for a tier, handling both one-time charges and subscriptions
 * This is the core business logic of the checkout process
 */
export async function processPayment(
  tierId: string,
  annual: boolean
): Promise<{
  success: boolean;
  stripeId: string;
  type: "charge" | "subscription";
}> {
  const user = await requireUser();

  // Get and validate tier
  const tier = await getTierById(tierId);
  if (!tier) {
    throw new Error("Tier not found.");
  }

  // Get and validate vendor using the vendor service
  const vendor = await getVendorOrganizationById(tier.organizationId);
  if (!vendor || !vendor.stripeAccountId) {
    throw new Error("Vendor not valid.");
  }

  // Get Stripe customer ID using customer service
  const stripeCustomerId = await getOrCreateStripeCustomerIdForVendor(
    vendor.stripeAccountId,
    user.id
  );

  const stripePriceId = annual ? tier.stripePriceIdAnnual : tier.stripePriceId;
  if (!stripePriceId) {
    throw new Error("Tier does not have a Stripe Price ID.");
  }

  // Handle one-time charges
  if (tier.cadence === "once" && tier.price) {
    return await processOneTimeCharge(
      vendor.stripeAccountId,
      stripeCustomerId,
      stripePriceId,
      user.id,
      tierId,
      tier.price,
      vendor.billing?.planType || null
    );
  }

  // Handle subscriptions
  return await processSubscription(
    vendor.stripeAccountId,
    stripeCustomerId,
    stripePriceId,
    user.id,
    tierId,
    tier,
    vendor.billing?.planType || null,
    annual
  );
}

/**
 * Process a one-time charge payment
 * @private
 */
async function processOneTimeCharge(
  vendorStripeAccountId: string,
  stripeCustomerId: string,
  stripePriceId: string,
  userId: string,
  tierId: string,
  price: number,
  vendorPlanType: PlanType | null
): Promise<{ success: boolean; stripeId: string; type: "charge" }> {
  // Get payment method using customer service
  const paymentMethodId = await getStripePaymentMethodIdForVendor(vendorStripeAccountId, userId);

  if (!paymentMethodId) {
    throw new Error("No payment method found for this vendor");
  }

  const charge = await createStripeCharge(
    vendorStripeAccountId,
    stripeCustomerId,
    stripePriceId,
    price,
    paymentMethodId,
    vendorPlanType
  );

  if (charge.status !== "succeeded") {
    throw new Error(`Error creating charge on Stripe: ${charge.status}`);
  }

  // Create local charge record using user ID
  await createLocalCharge(userId, tierId, charge.id);

  return {
    success: true,
    stripeId: charge.id,
    type: "charge"
  };
}

/**
 * Process a subscription payment
 * @private
 */
async function processSubscription(
  vendorStripeAccountId: string,
  stripeCustomerId: string,
  stripePriceId: string,
  userId: string,
  tierId: string,
  tier: any,
  vendorPlanType: PlanType | null,
  annual: boolean
): Promise<{ success: boolean; stripeId: string; type: "subscription" }> {
  // Check if already subscribed
  const isSubscribed = await isSubscribedToStripeTier(
    vendorStripeAccountId,
    stripeCustomerId,
    tier
  );

  if (isSubscribed) {
    throw new Error(
      "You are already subscribed to this product. If you don't see it in your dashboard, please contact support."
    );
  }

  // Create subscription in Stripe
  const tierPrice = annual && tier.priceAnnual ? tier.priceAnnual : tier.price || 0;
  const { subscription: stripeSubscription, platformFeeAmount } =
    await createStripeSubscriptionForCustomer(
      vendorStripeAccountId,
      stripeCustomerId,
      stripePriceId,
      tierPrice,
      tier.trialDays,
      vendorPlanType
    );

  if (!stripeSubscription) {
    throw new Error("Failed to create subscription on Stripe");
  }

  // Handle invoice status
  const invoice = stripeSubscription.latest_invoice as any;

  switch (invoice.status) {
    case "paid": {
      // Create local subscription record using user ID
      await createSubscription(userId, tierId, stripeSubscription.id, undefined, platformFeeAmount);
      break;
    }
    case "open":
      // For subscriptions with trials, "open" status is expected
      if (tier.trialDays && tier.trialDays > 0) {
        await createSubscription(
          userId,
          tierId,
          stripeSubscription.id,
          undefined,
          platformFeeAmount
        );
      } else {
        throw new Error("Subscription requires payment. Please check payment details.");
      }
      break;

    case "draft":
    case "void":
    case "uncollectible":
      throw new Error(`Invoice has unexpected status: ${invoice.status}`);

    default:
      throw new Error(
        `Unknown error occurred: invoice status was ${invoice.status}, subscription status was ${stripeSubscription.status}`
      );
  }

  return {
    success: true,
    stripeId: stripeSubscription.id,
    type: "subscription"
  };
}
