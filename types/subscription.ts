import { Prisma, Subscription } from "@/app/generated/prisma";

// Subscription states used throughout the application
export const SubscriptionStates = {
  renewing: "renewing",
  cancelled: "cancelled"
} as const;

/**
 * Subscription status types representing the different states a subscription can be in
 */
export type SubscriptionStatusType =
  | "not_subscribed" // No subscription exists
  | "active_renewing" // Subscription is active and will renew
  | "cancelled_active" // Subscription is cancelled but still active until end date
  | "expired"; // Subscription has ended

/**
 * Detailed subscription status information
 */
export interface SubscriptionStatus {
  statusType: SubscriptionStatusType;
  subscription: Subscription | null;
  expiryDate: Date | null;
}

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
 * Prisma validator for subscription with customer profile and tier data
 */
export const includeTierAndCustomer = Prisma.validator<Prisma.SubscriptionDefaultArgs>()({
  include: {
    customerProfile: {
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    },
    tier: true
  }
});

/**
 * Subscription with customer profile and tier data
 */
export type SubscriptionWithTierAndCustomer = Prisma.SubscriptionGetPayload<
  typeof includeTierAndCustomer
>;
