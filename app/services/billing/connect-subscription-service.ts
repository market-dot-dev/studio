"use server";

import { Subscription } from "@/app/generated/prisma";
import {
  confirmCustomerSubscription,
  confirmCustomerSubscriptionCancellation,
  notifyOwnerOfNewSubscription,
  notifyOwnerOfSubscriptionCancellation
} from "@/app/services/email-service";
import { getVendorOrganizationById } from "@/app/services/organization/vendor-organization-service";
import {
  cancelStripeSubscription,
  reactivateStripeSubscription
} from "@/app/services/stripe/stripe-subscription-service";
import { getTierById } from "@/app/services/tier/tier-service";
import { requireUser } from "@/app/services/user-context-service";
import prisma from "@/lib/prisma";
import {
  includeTierAndCustomer,
  SubscriptionStates,
  SubscriptionStatus,
  type SubscriptionWithTierAndCustomer
} from "@/types/subscription";
import { getCustomerProfileById } from "../customer-profile-service";

/**
 * Get a subscription by its ID with related customer profile and tier data
 *
 * @param subscriptionId - The ID of the subscription to get
 * @param includeInactive - Whether to include inactive subscriptions
 * @returns The subscription data or null if not found
 */
export async function getSubscriptionById(
  subscriptionId: string,
  includeInactive: boolean = false
): Promise<SubscriptionWithTierAndCustomer | null> {
  return await prisma.subscription.findFirst({
    where: {
      id: subscriptionId,
      ...(includeInactive ? {} : { active: true })
    },
    ...includeTierAndCustomer,
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
export async function getSubscriptionsForCurrentUser() {
  const user = await requireUser();
  const customerProfile = await getCustomerProfileById(user.id);

  return await prisma.subscription.findMany({
    where: {
      customerProfileId: customerProfile.id
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

/**
 * Get all subscriptions for a specific customer profile
 */
export async function getCustomerProfileSubscriptions(userId: string) {
  const customerProfile = await getCustomerProfileById(userId);

  return await prisma.subscription.findMany({
    where: {
      customerProfileId: customerProfile.id
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

/**
 * Create a subscription for a user
 */
export async function createSubscription(
  userId: string,
  tierId: string,
  stripeSubscriptionId: string,
  tierVersionId?: string,
  platformFeeAmount?: number
): Promise<Subscription> {
  const customerProfile = await getCustomerProfileById(userId);
  if (!customerProfile) throw new Error("Customer profile not found");

  const tier = await getTierById(tierId);
  if (!tier) throw new Error("Tier not found");
  if (!tier.stripePriceId) throw new Error("Stripe price ID not found for tier");

  const vendorOrg = await getVendorOrganizationById(tier.organizationId);
  if (!vendorOrg || !vendorOrg.stripeAccountId) {
    throw new Error("Vendor organization not found or Stripe account not connected");
  }

  // Check for existing active subscription
  const existingActiveSubscription = await prisma.subscription.findFirst({
    where: {
      customerProfileId: customerProfile.id,
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
    return await reactivateSubscription(existingActiveSubscription.id);
  }

  // If we have an existing active subscription that is NOT cancelled,
  // we should prevent creating another one
  if (
    existingActiveSubscription &&
    existingActiveSubscription.state === SubscriptionStates.renewing
  ) {
    throw new Error("User already has an active subscription to this tier");
  }

  // Deactivate any previous subscriptions for this customer-tier combination
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
      customerProfileId: customerProfile.id,
      tierId,
      tierVersionId,
      stripeSubscriptionId,
      cancelledAt: null,
      activeUntil: null,
      tierRevision: tier.revision,
      platformFeeAmount: platformFeeAmount || null,
      active: true
    }
  });

  // Send notification emails
  await Promise.all([
    notifyOwnerOfNewSubscription(vendorOrg.owner.id, customerProfile.user, tier.name),
    confirmCustomerSubscription(customerProfile.user, tier.name)
  ]);

  return newSubscription;
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<Subscription> {
  const currentUser = await requireUser();
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
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
    throw new Error("Subscription not found");
  }

  // Check authorization - either the customer or the vendor organization
  const isCustomer = subscription.customerProfile?.userId === currentUser.id;
  const isVendor = subscription.tier.organizationId === currentUser.currentOrganizationId;

  if (!isCustomer && !isVendor) {
    throw new Error("Not authorized to cancel subscription");
  }

  const vendorOrg = subscription.tier.organization;
  if (!vendorOrg.stripeAccountId) {
    throw new Error("Vendor's Stripe account not connected");
  }

  // Schedule cancellation at the end of the current period
  const stripeSubscription = await cancelStripeSubscription(
    vendorOrg.stripeAccountId,
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
    notifyOwnerOfSubscriptionCancellation(
      vendorOrg.owner,
      subscription.customerProfile!.user,
      subscription.tier.name
    ),
    confirmCustomerSubscriptionCancellation(
      subscription.customerProfile!.user,
      subscription.tier.name
    )
  ]);

  return updatedSubscription;
}

/**
 * Get detailed subscription status for a user and tier
 */
export async function getSubscriptionStatus(
  userId: string,
  tierId: string
): Promise<SubscriptionStatus> {
  if (!userId) {
    return {
      statusType: "not_subscribed",
      subscription: null,
      expiryDate: null
    };
  }

  const customerProfile = await getCustomerProfileById(userId);

  const subscription = await prisma.subscription.findFirst({
    where: {
      customerProfileId: customerProfile.id,
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

  if (!subscription) {
    return {
      statusType: "not_subscribed",
      subscription: null,
      expiryDate: null
    };
  }

  const now = new Date();

  if (subscription.state === SubscriptionStates.renewing) {
    return {
      statusType: "active_renewing",
      subscription,
      expiryDate: null
    };
  }

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

  return {
    statusType: "expired",
    subscription,
    expiryDate: subscription.activeUntil
  };
}

/**
 * Reactivate a cancelled subscription
 */
export async function reactivateSubscription(subscriptionId: string): Promise<Subscription> {
  const currentUser = await requireUser();

  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
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
    throw new Error("Subscription not found");
  }

  // Verify the user is authorized
  if (subscription.customerProfile?.userId !== currentUser.id) {
    throw new Error("Not authorized to modify this subscription");
  }

  if (subscription.state !== SubscriptionStates.cancelled) {
    throw new Error("Subscription is not in a cancelled state");
  }

  if (!subscription.activeUntil || subscription.activeUntil <= new Date()) {
    throw new Error("Subscription has already expired");
  }

  const vendorOrg = subscription.tier.organization;
  if (!vendorOrg.stripeAccountId) {
    throw new Error("Vendor's Stripe account not found");
  }

  await reactivateStripeSubscription(vendorOrg.stripeAccountId, subscription.stripeSubscriptionId);

  const updatedSubscription = await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      state: SubscriptionStates.renewing,
      cancelledAt: null
    }
  });

  await Promise.all([
    confirmCustomerSubscription(subscription.customerProfile!.user, subscription.tier.name),
    notifyOwnerOfNewSubscription(
      vendorOrg.owner.id,
      subscription.customerProfile!.user,
      subscription.tier.name
    )
  ]);

  return updatedSubscription;
}

/**
 * Deactivate expired subscriptions
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
 */
export async function getSubscriptionHistory(tierId: string) {
  const user = await requireUser();
  const customerProfile = await getCustomerProfileById(user.id);

  return await prisma.subscription.findMany({
    where: {
      customerProfileId: customerProfile.id,
      tierId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}
