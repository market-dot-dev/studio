"use server";

import { PlanType } from "@/app/generated/prisma";
import Stripe from "stripe";
import { mapStripeStatusToSubscriptionStatus } from "../../../types/platform";
import { getBillingByStripeCustomerId, updateBilling } from "./platform-billing-service";

/**
 * Handle subscription changes from Stripe webhooks
 */
export async function handleSubscriptionChange(subscription: Stripe.Subscription): Promise<void> {
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

    await updateBilling(billing.organizationId, {
      planType: PlanType.PRO,
      stripeSubscriptionId: subscriptionId,
      stripeProductId: typeof plan?.product === "string" ? plan.product : null,
      subscriptionStatus: mappedStatus
    });
  } else if (status === "canceled" || status === "unpaid") {
    // Downgrade to FREE plan and clear Stripe data
    await updateBilling(billing.organizationId, {
      planType: PlanType.FREE,
      stripeSubscriptionId: null,
      stripeProductId: null,
      subscriptionStatus: null // No subscription status for FREE plan
    });
  } else {
    // For other statuses (incomplete, past_due, etc.), keep PRO but update status
    await updateBilling(billing.organizationId, {
      subscriptionStatus: mappedStatus
    });
  }
}
