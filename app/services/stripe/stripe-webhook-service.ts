"use server";

import prisma from "@/lib/prisma";
import { ErrorMessageCode } from "@/types/stripe";
import Stripe from "stripe";
import { checkVendorStripeStatusByOrgId } from "./stripe-vendor-service";
import {
  handleCancelledSubscriptionFromWebhook,
  updateSubscriptionFromWebhook
} from "./stripe-webhook-helpers";

/**
 * Handles Stripe account events for organizations
 * @param event - The Stripe event object
 */
export async function handleAccountEvent(event: Stripe.Event) {
  const accountEvent = event.data.object as Stripe.Account;
  const accountId = event.account;

  const organization = await prisma.organization.findUnique({
    where: { stripeAccountId: accountId }
  });

  if (!organization) {
    console.error(`No organization found with Stripe account ID: ${accountId}`);
    return;
  }

  if (event.type === "account.updated") {
    await checkVendorStripeStatusByOrgId(organization.id, true);
    console.log(`Updated account status for organization ${organization.id}`);
  } else if (event.type === "account.application.deauthorized") {
    await prisma.organization.update({
      where: { id: organization.id },
      data: {
        stripeAccountId: null,
        stripeAccountDisabled: true,
        stripeAccountDisabledReason: JSON.stringify([ErrorMessageCode.StripeAccountDisconnected])
      }
    });
    console.log(`Disconnected Stripe account for organization ${organization.id}`);
  }
}

/**
 * Handles Stripe subscription events for organizations
 * @param event - The Stripe event object
 */
export async function handleSubscriptionEvent(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const accountId = event.account; // Connect account ID

  console.log(
    `Processing ${event.type} for subscription ${subscription.id} from account ${accountId || "platform"}`
  );

  const subItem = subscription.items.data[0];
  const activeUntil = subItem.current_period_end
    ? new Date(subItem.current_period_end * 1000)
    : null;

  if (event.type === "customer.subscription.deleted" || subscription.status === "canceled") {
    await handleCancelledSubscriptionFromWebhook(subscription.id, activeUntil);
  } else if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.created"
  ) {
    // For "created" events, this will only work if we already have the subscription in our database
    // which should be the case for subscriptions created through our platform
    await updateSubscriptionFromWebhook(subscription.id, subscription.status, activeUntil);
  }
}

/**
 * Handles critical Stripe charge events for organizations
 * @param event - The Stripe event object
 */
export async function handleChargeEvent(event: Stripe.Event) {
  const charge = event.data.object as Stripe.Charge;
  const accountId = event.account;

  if (event.type === "charge.refunded") {
    // Logging the refund for awareness
    const localCharge = await prisma.charge.findUnique({
      where: { stripeChargeId: charge.id },
      include: {
        organization: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (localCharge) {
      console.log(
        `REFUND ALERT: Charge ${charge.id} was refunded for $${charge.amount_refunded / 100} ` +
          `by vendor (account ${accountId}). ` +
          `Customer organization: ${localCharge.organization?.name} (${localCharge.organization?.id}). ` +
          `Our internal charge ID: ${localCharge.id}`
      );

      // No database updates since there's no refund tracking in the schema
    } else {
      console.log(`Refund for unknown charge ${charge.id} from account ${accountId}`);
    }
  }
}
