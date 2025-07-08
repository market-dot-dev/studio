"use server";

import prisma from "@/lib/prisma";
import { SubscriptionStates } from "@/types/subscription";
import {
  confirmCustomerSubscriptionCancellation,
  notifyOwnerOfSubscriptionCancellation
} from "../email-service";

/**
 * Updates a subscription's state based on a webhook event
 * For use only by the webhook handler - doesn't call back to Stripe
 */
export async function updateSubscriptionFromWebhook(
  stripeSubscriptionId: string,
  status: string,
  activeUntil: Date | null
): Promise<boolean> {
  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId },
    select: {
      id: true
    }
  });

  if (!subscription) {
    console.error(`No subscription found with Stripe ID: ${stripeSubscriptionId}`);
    return false;
  }

  const state = await mapStripeStatusToState(status);

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      state,
      activeUntil
    }
  });

  console.log(`Updated subscription ${subscription.id} state to ${state}`);
  return true;
}

/**
 * Processes a cancelled subscription from a webhook event
 * For use only by the webhook handler - doesn't call back to Stripe
 */
export async function handleCancelledSubscriptionFromWebhook(
  stripeSubscriptionId: string,
  activeUntil: Date | null
): Promise<boolean> {
  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId },
    include: {
      customerProfile: {
        include: {
          user: true
        }
      },
      tier: {
        include: {
          organization: {
            include: {
              owner: true
            }
          }
        }
      }
    }
  });

  if (!subscription) {
    console.error(`No subscription found with Stripe ID: ${stripeSubscriptionId}`);
    return false;
  }

  // Only process if not already cancelled
  if (subscription.state === SubscriptionStates.cancelled) {
    console.log(`Subscription ${subscription.id} already cancelled`);
    return true;
  }

  // Update the subscription record
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      state: SubscriptionStates.cancelled,
      cancelledAt: new Date(),
      activeUntil: activeUntil || new Date()
    }
  });

  // Send emails
  try {
    if (subscription.tier?.organization?.owner && subscription.customerProfile?.user) {
      await notifyOwnerOfSubscriptionCancellation(
        subscription.tier.organization.owner,
        subscription.customerProfile.user,
        subscription.tier.name
      );

      await confirmCustomerSubscriptionCancellation(
        subscription.customerProfile.user,
        subscription.tier.name
      );

      console.log(`Sent cancellation notifications for subscription ${subscription.id}`);
    }
  } catch (error) {
    console.error("Error sending cancellation emails:", error);
    // Don't fail the entire process due to email errors
  }

  return true;
}

/**
 * Maps Stripe subscription status to our internal state
 */
export async function mapStripeStatusToState(status: string) {
  switch (status) {
    case "active":
    case "trialing":
      return SubscriptionStates.renewing;
    default:
      return SubscriptionStates.cancelled;
  }
}
