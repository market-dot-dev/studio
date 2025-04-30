"use server";

import { createSubscription } from "@/app/services/SubscriptionService";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { includeVendorProfile, type VendorProfile } from "@/types/checkout";
import { type StripeCard } from "@/types/stripe";
import { Contract, Tier } from "@prisma/client";
import Stripe from "stripe";
import Customer from "../models/Customer";
import { createLocalCharge } from "./charge-service";
import { createStripeCharge } from "./stripe-payment-service";
import {
  createStripeSubscriptionForCustomer,
  isSubscribedToStripeTier
} from "./stripe-subscription-service";
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
  } catch (error: unknown) {
    console.error("Error creating setup intent:", error);
    return {
      clientSecret: null,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
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
  } catch (error: unknown) {
    console.error("Error attaching payment method:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add payment method"
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
  } catch (error: unknown) {
    console.error("Error detaching payment method:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove payment method"
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
  const stripePriceId = annual ? tier.stripePriceIdAnnual : tier.stripePriceId;

  if (!stripePriceId) {
    throw new Error("Tier does not have a Stripe Price ID.");
  }

  console.log("[purchase]: vendor, product check");

  // ## Charges
  if (tier.cadence === "once" && tier.price) {
    const charge = await createStripeCharge(
      vendor.stripeAccountId,
      stripeCustomerId,
      stripePriceId,
      tier.price,
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
  }
  // ## Subscriptions
  else {
    let stripeSubscription: Stripe.Subscription | null = null;

    const isSubscribed = await isSubscribedToStripeTier(
      vendor.stripeAccountId,
      stripeCustomerId,
      tier
    );
    if (isSubscribed) {
      console.log("[purchase]: FAIL already subscribed");
      throw new Error(
        "You are already subscribed to this product. If you dont see it in your dashboard, please contact support."
      );
    } else {
      stripeSubscription = await createStripeSubscriptionForCustomer(
        vendor.stripeAccountId,
        stripeCustomerId,
        stripePriceId,
        tier.trialDays
      );
    }

    // Fail if no stripe subscription found
    if (!stripeSubscription) {
      console.log("[purchase]: FAIL could not create stripe subscription");
      throw new Error("Error creating subscription on stripe");
    }
    // Otherwise, proceed checking out
    else {
      console.log("[purchase]: stripe subscription created");
      const invoice = stripeSubscription.latest_invoice as Stripe.Invoice;

      if (invoice.status === "paid") {
        await createSubscription(customerId, tierId, stripeSubscription.id);
        console.log("[purchase]: invoice paid");
      } else if (invoice.status === "open") {
        // For subscriptions with trials, "open" status is expected and acceptable
        if (tier.trialDays && tier.trialDays > 0) {
          await createSubscription(customerId, tierId, stripeSubscription.id);
          console.log("[purchase]: subscription with trial created, invoice is open");
        } else {
          // No trial but invoice not paid - likely needs customer action
          throw new Error(`Subscription requires payment. Please check payment details.`);
        }
      } else if (
        invoice.status === "draft" ||
        invoice.status === "void" ||
        invoice.status === "uncollectible"
      ) {
        // Clear error for problematic invoice statuses that shouldn't occur in normal flow
        throw new Error(`Invoice has unexpected status: ${invoice.status}`);
      } else {
        // Fallback for any other unexpected states
        throw new Error(
          `Unknown error occurred: invoice status was ${invoice.status}, subscription status was ${stripeSubscription.status}`
        );
      }
    }
  }
};
