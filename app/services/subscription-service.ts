"use server";

import prisma from "@/lib/prisma";
import {
  includeTierAndUser,
  isRenewing,
  SubscriptionStates,
  type SubscriptionWithTierAndUser
} from "@/types/subscription";
import { Subscription } from "@prisma/client";
import { getStripeCustomerId } from "./customer-service";
import {
  confirmCustomerSubscription,
  confirmCustomerSubscriptionCancellation,
  notifyOwnerOfNewSubscription,
  notifyOwnerOfSubscriptionCancellation
} from "./email-service";
import SessionService from "./session-service";
import { cancelStripeSubscription } from "./stripe-subscription-service";
import { getTierById } from "./tier-service";
import UserService from "./UserService";

/**
 * Get a subscription by its ID with related user and tier data
 *
 * @param subscriptionId - The ID of the subscription to get
 * @returns The subscription data or null if not found
 */
export async function getSubscriptionById(
  subscriptionId: string
): Promise<SubscriptionWithTierAndUser | null> {
  return await prisma.subscription.findUnique({
    where: {
      id: subscriptionId
    },
    ...includeTierAndUser
  });
}

/**
 * Count subscribers for a specific tier, optionally filtered by revision
 *
 * @param tierId - The tier ID to count subscribers for
 * @param revision - Optional tier revision to filter by
 * @returns The count of subscribers
 */
export async function getSubscriberCount(tierId: string, revision?: number): Promise<number> {
  return prisma.subscription.count({
    where: {
      tierId,
      tierRevision: revision ? revision : undefined
    }
  });
}

/**
 * Check if a tier has any subscribers
 *
 * @param tierId - The tier ID to check
 * @param revision - Optional tier revision to filter by
 * @returns True if the tier has subscribers
 */
export async function checkTierHasSubscribers(tierId: string, revision?: number): Promise<boolean> {
  const count = await getSubscriberCount(tierId, revision);
  return count > 0;
}

/**
 * Get a subscription for the current user by tier ID
 *
 * @param params - Object containing tierId
 * @returns The subscription or null if not found
 */
export async function getUserSubscriptionByTier({
  tierId
}: {
  tierId: string;
}): Promise<Subscription | null> {
  const userId = await SessionService.getCurrentUserId();
  if (!userId) return null;

  return await prisma.subscription.findUnique({
    where: {
      userId_tierId: {
        tierId,
        userId
      }
    }
  });
}

/**
 * Get all subscriptions for the current user
 *
 * @returns Array of subscriptions
 */
export async function getUserSubscriptions() {
  const userId = await SessionService.getCurrentUserId();
  if (!userId) return [];

  return await prisma.subscription.findMany({
    where: {
      userId
    }
  });
}

/**
 * Check if a user is subscribed to a specific tier
 *
 * @param userId - The user ID to check
 * @param tierId - The tier ID to check
 * @returns True if the user is subscribed
 */
export async function checkUserSubscribedToTier(userId: string, tierId: string): Promise<boolean> {
  const currentDate = new Date();
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      tierId,
      OR: [
        {
          state: SubscriptionStates.renewing
        },
        {
          state: SubscriptionStates.cancelled,
          activeUntil: {
            gt: currentDate
          }
        }
      ]
    }
  });

  return subscription ? isRenewing(subscription) : false;
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

  const stripeCustomerId = await getStripeCustomerId(user, vendor.stripeAccountId);
  if (!stripeCustomerId) throw new Error("Stripe customer ID not found for user");

  const existingSubscription = await getUserSubscriptionByTier({ tierId });

  const attributes = {
    state: SubscriptionStates.renewing,
    userId: userId,
    tierId: tierId,
    tierVersionId: tierVersionId,
    stripeSubscriptionId,
    cancelledAt: null,
    activeUntil: null,
    tierRevision: tier.revision
  };

  let result: Subscription;

  if (existingSubscription) {
    result = await prisma.subscription.update({
      where: {
        id: existingSubscription.id
      },
      data: attributes
    });
  } else {
    result = await prisma.subscription.create({
      data: attributes
    });
  }

  await Promise.all([
    // send email to the tier owner
    notifyOwnerOfNewSubscription(tier.userId, user, tier.name),
    // send email to the customer
    confirmCustomerSubscription(user, tier.name)
  ]);

  return result;
}

/**
 * Cancel a subscription
 *
 * @param subscriptionId - The ID of the subscription to cancel
 * @returns The updated subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<Subscription> {
  const user = await SessionService.getSessionUser();
  if (!user) {
    throw new Error("User not found");
  }

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

  const stripeSubscription = await cancelStripeSubscription(
    maintainer.stripeAccountId,
    subscription.stripeSubscriptionId
  );

  const updatedSubscription = await prisma.subscription.update({
    data: {
      state: SubscriptionStates.cancelled,
      cancelledAt: new Date(),
      activeUntil: new Date(stripeSubscription.items.data[0].current_period_end * 1000)
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
 * Update a subscription with new attributes
 *
 * @param subscriptionId - The ID of the subscription to update
 * @param attributes - The attributes to update
 * @returns The updated subscription
 */
export async function updateSubscription(
  subscriptionId: string,
  attributes: Partial<Subscription>
): Promise<Subscription> {
  return await prisma.subscription.update({
    where: {
      id: subscriptionId
    },
    data: attributes
  });
}
