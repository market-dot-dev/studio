"use server";

import { getRootUrl } from "@/lib/domain";
import { PlanPricing } from "../../../types/platform";
import { createStripeClient } from "../stripe/create-stripe-client";
import { requireOrganization, requireUser } from "../user-context-service";
import { getOrCreateBilling, updateCurrentBilling } from "./platform-billing-service";

/**
 * Get platform plan pricing configuration
 */
export function getPlanPricing(): PlanPricing {
  return {
    basic: {
      monthly: process.env.PLATFORM_STRIPE_BASIC_MONTHLY_PRICE_ID ?? "",
      yearly: process.env.PLATFORM_STRIPE_BASIC_YEARLY_PRICE_ID ?? ""
    },
    pro: {
      monthly: process.env.PLATFORM_STRIPE_PRO_MONTHLY_PRICE_ID ?? "",
      yearly: process.env.PLATFORM_STRIPE_PRO_YEARLY_PRICE_ID ?? ""
    }
  };
}

/**
 * Create a Stripe checkout session for platform subscription
 */
export async function createCheckoutSession(priceId: string): Promise<{ url: string }> {
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

  const billingPageUrl = getRootUrl("app", "/settings/billing");

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
    cancel_url: `${billingPageUrl}?status=cancelled`,
    customer: billing.stripeCustomerId,
    client_reference_id: `${user.id}-${org.id}`, // creates a unique session for this user and org
    allow_promotion_codes: true,
    metadata: {
      organizationId: org.id,
      organizationName: org.name,
      userEmail: user.email!,
      type: "platform_subscription"
    },
    subscription_data: {
      description: `Platform subscription for: ${org.name}`
    }
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  return { url: session.url };
}

/**
 * Create a Stripe customer portal session for platform billing
 */
export async function createCustomerPortalSession(): Promise<{ url: string }> {
  const billing = await getOrCreateBilling();
  const stripe = await createStripeClient();

  if (!billing.stripeCustomerId || !billing.stripeProductId) {
    throw new Error("No Stripe customer ID or product ID found for organization");
  }

  const configurations = await stripe.billingPortal.configurations.list();
  const planPricing = getPlanPricing();

  // Get basic and pro prices objects to get their product IDs
  const basicPrice = await stripe.prices.retrieve(planPricing.basic.monthly);
  const proPrice = await stripe.prices.retrieve(planPricing.pro.monthly);

  const configurationSettings: any = {
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
            product: basicPrice.product as string,
            prices: [planPricing.basic.monthly, planPricing.basic.yearly]
          },
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
    return_url: getRootUrl("app", "/settings/billing"),
    configuration: configuration.id
  });

  return { url: session.url };
}
