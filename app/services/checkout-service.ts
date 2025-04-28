"use server";

import { createSubscription } from "@/app/services/SubscriptionService";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { includeVendorProfile, type StripeCard, type VendorProfile } from "@/types/checkout";
import { Contract, Tier } from "@prisma/client";
import Stripe from "stripe";
import Customer from "../models/Customer";
import { createLocalCharge } from "./charge-service";
import StripeService from "./StripeService";
import { getTierById } from "./tier-service";
import UserService from "./UserService";

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

// Get the user's payment method for a vendor
export async function getUserPaymentMethod(
  vendorUserId: string,
  vendorStripeAccountId: string
): Promise<StripeCard | null> {
  try {
    const customer = await getCustomerForUser(vendorUserId, vendorStripeAccountId);
    return await customer.getStripePaymentMethod();
  } catch (error) {
    console.error("Error getting payment method:", error);
    return null;
  }
}

/**
 * Creates a setup intent for the current user with the specified maintainer.
 * This allows securely collecting payment details with PaymentElement
 */
export async function createUserSetupIntent(
  vendorUserId: string,
  vendorStripeAccountId: string
): Promise<{ clientSecret: string | null; error: string | null }> {
  try {
    const user = await UserService.getCurrentUser();
    if (!user) {
      return { clientSecret: null, error: "Not authenticated" };
    }

    // Create a customer if needed
    const customer = new Customer(user, vendorUserId, vendorStripeAccountId);
    const customerId = await customer.getOrCreateStripeCustomerId();

    // Create the setup intent
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      stripeAccount: vendorStripeAccountId
    });

    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
      usage: "off_session"
    });

    return { clientSecret: setupIntent.client_secret, error: null };
  } catch (error: any) {
    console.error("Error creating setup intent:", error);
    return { clientSecret: null, error: error.message };
  }
}

// Add a new payment method
export async function addUserPaymentMethod(
  paymentMethodId: string,
  vendorUserId: string,
  vendorStripeAccountId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const customer = await getCustomerForUser(vendorUserId, vendorStripeAccountId);
    await customer.attachPaymentMethod(paymentMethodId);
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error attaching payment method:", error);
    return {
      success: false,
      error: error.message || "Failed to add payment method"
    };
  }
}

// Remove an existing payment method
export async function removeUserPaymentMethod(
  vendorUserId: string,
  vendorStripeAccountId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const customer = await getCustomerForUser(vendorUserId, vendorStripeAccountId);
    await customer.detachPaymentMethod();
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error detaching payment method:", error);
    return {
      success: false,
      error: error.message || "Failed to remove payment method"
    };
  }
}

// Get or create a customer for the current user
async function getCustomerForUser(
  vendorUserId: string,
  vendorStripeAccountId: string
): Promise<Customer> {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  const user = await UserService.findUser(session.user.id);
  if (!user) {
    throw new Error("User not found");
  }

  return new Customer(user, vendorUserId, vendorStripeAccountId);
}

// Check if the user can make a purchase (has a customer ID or can create one)
export async function canUserMakePayment(
  vendorUserId: string,
  vendorStripeAccountId: string
): Promise<boolean> {
  try {
    const customer = await getCustomerForUser(vendorUserId, vendorStripeAccountId);
    return customer.canBuy();
  } catch (error) {
    console.error("Error checking payment capability:", error);
    return false;
  }
}

export const processPayment = async (customerId: string, tierId: string, annual: boolean) => {
  let subscription = null;

  const tier = await getTierById(tierId);
  if (!tier) {
    throw new Error("Tier not found.");
  }

  if (!customerId) {
    throw new Error("Not logged in.");
  }

  const customerUser = await UserService.findUser(customerId);
  if (!customerUser) {
    throw new Error("User not found");
  }

  const vendor = await UserService.findUser(tier.userId);

  if (!vendor) {
    throw new Error("Vendor not found.");
  }

  if (!vendor.stripeAccountId) {
    throw new Error("Vendor does not have a connected Stripe account.");
  }

  const customer = new Customer(customerUser, vendor.id, vendor.stripeAccountId);

  const stripeCustomerId = await customer.getOrCreateStripeCustomerId();
  const stripeService = new StripeService(vendor.stripeAccountId);

  const stripePriceId = annual ? tier.stripePriceIdAnnual : tier.stripePriceId;

  if (!stripePriceId) {
    throw new Error("Tier does not have a Stripe Price ID.");
  }

  console.log("[purchase]: vendor, product check");

  if (tier.cadence === "once") {
    const charge = await stripeService.createCharge(
      stripeCustomerId,
      stripePriceId,
      tier.price!,
      await customer.getStripePaymentMethodId(),
      tier.applicationFeePercent || 0,
      tier.applicationFeePrice || 0
    );

    if (charge.status === "succeeded") {
      await createLocalCharge(customerId, tierId, charge.id);
    } else {
      console.log("[purchase]: FAIL charge failed", charge);
      throw new Error("Error creating charge on stripe: " + charge.status);
    }
  } else {
    if (await stripeService.isSubscribedToTier(stripeCustomerId, tier)) {
      console.log("[purchase]: FAIL already subscribed");
      throw new Error(
        "You are already subscribed to this product. If you dont see it in your dashboard, please contact support."
      );
    } else {
      subscription = await stripeService.createSubscription(
        stripeCustomerId,
        stripePriceId,
        tier.trialDays
      );
    }

    if (!subscription) {
      console.log("[purchase]: FAIL could not create stripe subscription");
      throw new Error("Error creating subscription on stripe");
    } else {
      console.log("[purchase]: stripe subscription created");
      const invoice = subscription.latest_invoice as Stripe.Invoice;

      if (invoice.status === "paid") {
        await createSubscription(customerId, tierId, subscription.id);
        console.log("[purchase]: invoice paid");
      } else if (invoice.payment_intent) {
        throw new Error(
          "Subscription attempt returned a payment intent, which should never happen."
        );
      } else {
        throw new Error(`Unknown error occurred: subscription status was ${subscription.status}`);
      }
    }
  }
};
