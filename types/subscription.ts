import { Prisma, Subscription } from "@prisma/client";

// Subscription states used throughout the application
export const SubscriptionStates = {
  renewing: "renewing",
  cancelled: "cancelled"
} as const;

export type SubscriptionState = (typeof SubscriptionStates)[keyof typeof SubscriptionStates];

/**
 * Check if a subscription is in its finishing month (still active but not renewing)
 *
 * @param subscription - The subscription entity to check
 * @returns True if the subscription is in its finishing month
 */
export function isFinishingMonth(subscription: Subscription): boolean {
  return !!subscription.activeUntil && subscription.activeUntil > new Date();
}

/**
 * Check if a subscription is set to renew
 *
 * @param subscription - The subscription entity to check
 * @returns True if the subscription is renewing
 */
export function isRenewing(subscription: Subscription): boolean {
  return subscription.state === SubscriptionStates.renewing;
}

/**
 * Check if a subscription is active (either renewing or in its finishing month)
 *
 * @param subscription - The subscription entity to check
 * @returns True if the subscription is active
 */
export function isActive(subscription: Subscription): boolean {
  return isRenewing(subscription) || isFinishingMonth(subscription);
}

/**
 * Check if a subscription has been cancelled
 *
 * @param subscription - The subscription entity to check
 * @returns True if the subscription is cancelled
 */
export function isCancelled(subscription: Subscription): boolean {
  return subscription.state === SubscriptionStates.cancelled;
}

/**
 * Prisma validator for vendor profile with minimal fields
 */
export const includeTierAndUser = Prisma.validator<Prisma.SubscriptionDefaultArgs>()({
  // @TODO: Could have a smaller "select" here too
  include: {
    user: true,
    tier: true
  }
});

/**
 * Vendor profile data type
 */
export type SubscriptionWithTierAndUser = Prisma.SubscriptionGetPayload<typeof includeTierAndUser>;
