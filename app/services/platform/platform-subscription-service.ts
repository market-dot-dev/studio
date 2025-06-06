"use server";

import { mapStripeStatusToSubscriptionStatus } from "../../../types/platform";
import { createStripeClient } from "../stripe/create-stripe-client";
import { getBillingByStripeCustomerId, updateBilling } from "./platform-billing-service";

/**
 * Handle subscription changes from Stripe webhooks
 */
export async function handleSubscriptionChange(
  subscription: any // Stripe.Subscription
): Promise<void> {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const status = subscription.status;

  const billing = await getBillingByStripeCustomerId(customerId);
  if (!billing) {
    console.error("Platform billing not found for Stripe customer:", customerId);
    return;
  }

  const mappedStatus = mapStripeStatusToSubscriptionStatus(status);

  if (status === "active" || status === "trialing") {
    const plan = subscription.items.data[0]?.plan;

    // Fetch the product details to get the name
    let planName = "";
    if (plan?.product) {
      try {
        const stripe = await createStripeClient();
        const product = await stripe.products.retrieve(plan.product as string);
        planName = product.name; // Use the product name instead of price nickname
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    }

    await updateBilling(billing.organizationId, {
      stripeSubscriptionId: subscriptionId,
      stripeProductId: plan?.product as string,
      planName: planName,
      subscriptionStatus: mappedStatus
    });
  } else if (status === "canceled" || status === "unpaid") {
    await updateBilling(billing.organizationId, {
      stripeSubscriptionId: null,
      stripeProductId: null,
      planName: null,
      subscriptionStatus: mappedStatus
    });
  } else {
    // For other statuses, just update the status
    await updateBilling(billing.organizationId, {
      subscriptionStatus: mappedStatus
    });
  }
}
