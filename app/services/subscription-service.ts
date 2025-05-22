"use server";

import { Subscription } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import {
  includeTierAndOrg,
  SubscriptionStates,
  SubscriptionStatus,
  type SubscriptionWithTierAndOrg
} from "@/types/subscription";
import {
  confirmCustomerSubscription,
  confirmCustomerSubscriptionCancellation,
  notifyOwnerOfNewSubscription,
  notifyOwnerOfSubscriptionCancellation
} from "./email-service";
import { getStripeCustomerId } from "./organization-customer-service";
import {
  cancelStripeSubscription,
  reactivateStripeSubscription
} from "./stripe/stripe-subscription-service";
import { getTierById } from "./tier/tier-service";
import { getCurrentUserSession, requireUserSession } from "./user-context-service";
import UserService from "./UserService";

/**
 * Get a subscription by its ID with related user and tier data
 *
 * @param subscriptionId - The ID of the subscription to get
 * @param includeInactive - Whether to include inactive subscriptions
 * @returns The subscription data or null if not found
 */
export async function getSubscriptionById(
  subscriptionId: string,
  includeInactive: boolean = false
): Promise<SubscriptionWithTierAndOrg | null> {
  return await prisma.subscription.findFirst({
    where: {
      id: subscriptionId,
      ...(includeInactive ? {} : { active: true })
    },
    ...includeTierAndOrg,
    orderBy: {
      createdAt: "desc" // Get the most recent one first
    }
  });
}

/**
 * Count subscribers for a specific tier, optionally filtered by revision
 *
 * @param tierId - The tier ID to count subscribers for
 * @param revision - Optional tier revision to filter by
 * @param includeInactive - Whether to include inactive subscriptions
 * @returns The count of subscribers
 */
export async function getSubscriberCount(
  tierId: string,
  revision?: number,
  includeInactive: boolean = false
): Promise<number> {
  return prisma.subscription.count({
    where: {
      tierId,
      ...(revision ? { tierRevision: revision } : {}),
      ...(includeInactive ? {} : { active: true })
    }
  });
}

/**
 * Check if a tier has any subscribers
 *
 * @param tierId - The tier ID to check
 * @param revision - Optional tier revision to filter by
 * @param includeInactive - Whether to include inactive subscriptions
 * @returns True if the tier has subscribers
 */
export async function checkTierHasSubscribers(
  tierId: string,
  revision?: number,
  includeInactive: boolean = false
): Promise<boolean> {
  const count = await getSubscriberCount(tierId, revision, includeInactive);
  return count > 0;
}

/**
 * Get all subscriptions for the current user
 *
 * @returns Array of subscriptions
 */
export async function getUserSubscriptions() {
  const user = await requireUserSession();

  return await prisma.subscription.findMany({
    where: {
      userId: user.id
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

/**
 * Create a subscription for a user
 *
 * @param userId - The user ID to create the subscription for
 * @param tierId - The tier ID to subscribe to
 * @param stripeSubscriptionId - The Stripe subscription ID
 * @param tierVersionId - Optional tier version ID
 * @returns The created subscription
 */
export async function createSubscription(
  userId: string,
  tierId: string,
  stripeSubscriptionId: string,
  tierVersionId?: string
): Promise<Subscription> {
  const user = await UserService.findUser(userId);
  if (!user) throw new Error("User not found");

  const tier = await getTierById(tierId);
  if (!tier) throw new Error("Tier not found");
  if (!tier.stripePriceId) throw new Error("Stripe price ID not found for tier");

  const vendor = await UserService.findUser(tier.userId);
  if (!vendor) throw new Error("Vendor not found");
  if (!vendor.stripeAccountId) throw new Error("Vendor's account not connected to Stripe");

  const stripeCustomerId = await getStripeCustomerId(user, vendor.stripeAccountId); // @TODO
  if (!stripeCustomerId) throw new Error("Stripe customer ID not found for user");

  // Check for existing active subscription
  const existingActiveSubscription = await prisma.subscription.findFirst({
    where: {
      userId,
      tierId,
      active: true
    }
  });

  // If we have an existing ACTIVE subscription that's cancelled but not expired,
  // we should reactivate it instead of creating a new one
  if (
    existingActiveSubscription &&
    existingActiveSubscription.state === SubscriptionStates.cancelled &&
    existingActiveSubscription.activeUntil &&
    existingActiveSubscription.activeUntil > new Date()
  ) {
    return await reactivateSubscription(existingActiveSubscription.id, userId);
  }

  // If we have an existing active subscription that is NOT cancelled,
  // we should prevent creating another one
  if (
    existingActiveSubscription &&
    existingActiveSubscription.state === SubscriptionStates.renewing
  ) {
    throw new Error("User already has an active subscription to this tier");
  }

  // Deactivate any previous subscriptions for this user-tier combination
  if (existingActiveSubscription) {
    await prisma.subscription.update({
      where: {
        id: existingActiveSubscription.id
      },
      data: {
        active: false
      }
    });
  }

  // Create the new subscription
  const newSubscription = await prisma.subscription.create({
    data: {
      state: SubscriptionStates.renewing,
      userId,
      tierId,
      tierVersionId,
      stripeSubscriptionId,
      cancelledAt: null,
      activeUntil: null,
      tierRevision: tier.revision,
      active: true
    }
  });

  // Send notification emails
  await Promise.all([
    // send email to the tier owner
    notifyOwnerOfNewSubscription(tier.userId, user, tier.name),
    // send email to the customer
    confirmCustomerSubscription(user, tier.name)
  ]);

  return newSubscription;
}

/**
 * Cancel a subscription
 *
 * @param subscriptionId - The ID of the subscription to cancel
 * @returns The updated subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<Subscription> {
  const user = await requireUserSession();
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    include: {
      user: true, // customer
      tier: {
        select: {
          name: true,
          user: true // tier owner
        }
      }
    }
  });

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  const isMaintainer = subscription.tier.user.id === user.id;
  const isSubscriber = !isMaintainer && subscription.user.id === user.id;

  const maintainer = isMaintainer
    ? user
    : isSubscriber
      ? await UserService.findUser(subscription.tier.user.id)
      : null;

  if (!maintainer?.stripeAccountId) {
    throw new Error("Not authorized to cancel subscription or stripe account not connected");
  }

  // Schedule cancellation at the end of the current period
  const stripeSubscription = await cancelStripeSubscription(
    maintainer.stripeAccountId,
    subscription.stripeSubscriptionId
  );

  const updatedSubscription = await prisma.subscription.update({
    data: {
      state: SubscriptionStates.cancelled,
      cancelledAt: new Date(),
      activeUntil: new Date(stripeSubscription.items.data[0].current_period_end * 1000)
      // Note: We don't set active: false here because the subscription is still active
      // until the end of the period. It will be deactivated when a new subscription is created
      // or when it expires.
    },
    where: {
      id: subscriptionId
    }
  });

  await Promise.all([
    // inform the tier owner
    subscription?.tier?.user
      ? notifyOwnerOfSubscriptionCancellation(
          subscription.tier.user,
          subscription.user,
          subscription.tier.name
        )
      : null,
    // inform the customer
    subscription.user
      ? confirmCustomerSubscriptionCancellation(subscription.user, subscription.tier.name ?? "")
      : null
  ]);

  return updatedSubscription;
}

/**
 * Get detailed subscription status for an organization and tier
 *
 * @param customerId - The organization ID to check
 * @param tierId - The tier ID to check
 * @returns Detailed subscription status information
 */
export async function getSubscriptionStatus(
  customerId: string,
  tierId: string
): Promise<SubscriptionStatus> {
  if (!customerId) {
    return {
      statusType: "not_subscribed",
      subscription: null,
      expiryDate: null
    };
  }

  // Get the subscription if it exists
  const subscription = await prisma.subscription.findFirst({
    where: {
      organizationId: customerId,
      tierId,
      active: true
    },
    include: {
      tier: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  // If no subscription exists
  if (!subscription) {
    return {
      statusType: "not_subscribed",
      subscription: null,
      expiryDate: null
    };
  }

  const now = new Date();

  // Active subscription that will renew
  if (subscription.state === SubscriptionStates.renewing) {
    return {
      statusType: "active_renewing",
      subscription,
      expiryDate: null
    };
  }

  // Cancelled subscription that's still active
  if (
    subscription.state === SubscriptionStates.cancelled &&
    subscription.activeUntil &&
    subscription.activeUntil > now
  ) {
    return {
      statusType: "cancelled_active",
      subscription,
      expiryDate: subscription.activeUntil
    };
  }

  // Subscription has expired
  return {
    statusType: "expired",
    subscription,
    expiryDate: subscription.activeUntil
  };
}

/**
 * Deactivate expired subscriptions
 * This could be called by a cron job or webhook handler
 */
export async function deactivateExpiredSubscriptions(): Promise<number> {
  const now = new Date();

  const result = await prisma.subscription.updateMany({
    where: {
      state: SubscriptionStates.cancelled,
      activeUntil: {
        lt: now
      },
      active: true
    },
    data: {
      active: false
    }
  });

  return result.count;
}

/**
 * Get subscription history for the current user and a specific tier
 *
 * @param tierId - The tier ID to get history for
 * @returns Array of subscriptions ordered by creation date (newest first)
 */
export async function getSubscriptionHistory(tierId: string) {
  const user = await requireUserSession();
  return await prisma.subscription.findMany({
    where: {
      userId: user.id,
      tierId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

/**
 * Reactivate a cancelled subscription
 *
 * This function reactivates a subscription that has been cancelled but is still
 * within its active period. It removes the cancellation schedule in Stripe and
 * updates the local subscription record to reflect the renewed status.
 *
 * @param subscriptionId - The ID of the subscription to reactivate
 * @param userId - Optional user ID override (mainly for internal use)
 * @returns The updated subscription
 */
export async function reactivateSubscription(
  subscriptionId: string,
  userId?: string
): Promise<Subscription> {
  // Get the current user if userId isn't provided
  let user;
  if (userId) {
    user = await UserService.findUser(userId);
  } else {
    user = await getCurrentUserSession();
  }

  if (!user) {
    throw new Error("User not found");
  }

  // Get the subscription with related data
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    include: {
      user: true, // customer
      tier: {
        select: {
          name: true,
          user: true // tier owner
        }
      }
    }
  });

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  // Verify the user is authorized (either explicitly provided userId or current user)
  if (subscription.userId !== user.id) {
    throw new Error("Not authorized to modify this subscription");
  }

  // Verify the subscription is in a cancelled state
  if (subscription.state !== SubscriptionStates.cancelled) {
    throw new Error("Subscription is not in a cancelled state");
  }

  // Verify the subscription is still active (hasn't expired)
  if (!subscription.activeUntil || subscription.activeUntil <= new Date()) {
    throw new Error("Subscription has already expired");
  }

  // Get the vendor's Stripe account ID
  const vendor = subscription.tier.user;
  if (!vendor.stripeAccountId) {
    throw new Error("Vendor's Stripe account not found");
  }

  // Reactivate the subscription in Stripe
  await reactivateStripeSubscription(vendor.stripeAccountId, subscription.stripeSubscriptionId);

  // Update the local subscription record
  const updatedSubscription = await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      state: SubscriptionStates.renewing,
      cancelledAt: null
    }
  });

  // Send notification emails to customer and vendor
  await Promise.all([
    confirmCustomerSubscription(subscription.user, subscription.tier.name),
    notifyOwnerOfNewSubscription(vendor.id, subscription.user, subscription.tier.name)
  ]);

  return updatedSubscription;
}
