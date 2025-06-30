"use server";

import { getRootUrl } from "@/lib/domain";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { PlanPricing } from "../../../types/platform";
import { createStripeClient } from "../stripe/create-stripe-client";
import { requireOrganization, requireUser } from "../user-context-service";
import { getOrCreateBilling, updateCurrentBilling } from "./platform-billing-service";
import { getCachedPricing } from "./platform-pricing-service";

/**
 * Get platform plan pricing configuration from Stripe
 */
export async function getPlanPricing(): Promise<PlanPricing> {
  const pricing = await getCachedPricing();

  return {
    pro: {
      monthly: pricing.pro_monthly.id,
      yearly: pricing.pro_annually.id
    }
  };
}

/**
 * Create a Stripe checkout session for platform subscription
 */
export async function createCheckoutSession(priceId: string, returnPath?: string): Promise<void> {
  const org = await requireOrganization();
  const user = await requireUser();
  const stripe = await createStripeClient(); // Platform uses main Stripe account, not Connect

  // Get or create platform billing record
  const billing = await getOrCreateBilling();

  // Generate a Stripe customer if not already present
  if (!billing.stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      name: org.name,
      metadata: {
        organizationId: org.id,
        organizationName: org.name,
        userId: user.id
      }
    });

    // Update the billing record with the new stripeCustomerId
    await updateCurrentBilling({
      stripeCustomerId: customer.id
    });
    billing.stripeCustomerId = customer.id; // Update locally for session creation
  }

  const returnUrl = getRootUrl("app", returnPath || "/settings/billing");

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    mode: "subscription",
    success_url: `${getRootUrl("app")}/api/platform/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${returnUrl}?status=cancelled`,
    customer: billing.stripeCustomerId,
    client_reference_id: `${user.id}-${org.id}`, // creates a unique session for this user and org
    allow_promotion_codes: true,
    metadata: {
      organizationId: org.id,
      organizationName: org.name,
      userEmail: user.email!,
      type: "platform_subscription",
      returnUrl
    },
    subscription_data: {
      description: `Platform subscription for: ${org.name}`
    }
  });

  redirect(session.url!);
}

/**
 * Create a Stripe customer portal session for platform billing
 */
export async function createCustomerPortalSession(returnPath?: string): Promise<{ url: string }> {
  const billing = await getOrCreateBilling();
  const stripe = await createStripeClient();

  if (!billing.stripeCustomerId) {
    throw new Error("No Stripe customer ID found for organization");
  }

  const configurations = await stripe.billingPortal.configurations.list();
  const planPricing = await getPlanPricing();

  // Get pro price object to get its product ID
  const proPrice = await stripe.prices.retrieve(planPricing.pro.monthly);

  const configurationSettings: Stripe.BillingPortal.ConfigurationCreateParams = {
    business_profile: {
      headline: "Manage your platform subscription",
      privacy_policy_url: process.env.PRIVACY_POLICY_URL,
      terms_of_service_url: process.env.TERMS_URL
    },
    features: {
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      subscription_update: {
        enabled: true,
        default_allowed_updates: ["price", "promotion_code"],
        proration_behavior: "always_invoice",
        products: [
          {
            product: proPrice.product as string,
            prices: [planPricing.pro.monthly, planPricing.pro.yearly]
          }
        ]
      },
      subscription_cancel: {
        enabled: true,
        mode: "at_period_end",
        cancellation_reason: {
          enabled: true,
          options: ["too_expensive", "missing_features", "switched_service", "unused", "other"]
        }
      },
      customer_update: {
        allowed_updates: ["email", "tax_id"],
        enabled: true
      }
    }
  };

  // Update or create configuration
  const configuration =
    configurations.data.length > 0
      ? await stripe.billingPortal.configurations.update(
          configurations.data[0].id,
          configurationSettings
        )
      : await stripe.billingPortal.configurations.create(configurationSettings);

  const session = await stripe.billingPortal.sessions.create({
    customer: billing.stripeCustomerId,
    return_url: getRootUrl("app", returnPath || "/settings/billing"),
    configuration: configuration.id
  });

  return { url: session.url };
}
