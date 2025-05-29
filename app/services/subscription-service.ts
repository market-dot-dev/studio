"use server";

import { Subscription } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import {
  includeTierAndOrg,
  SubscriptionStates,
  SubscriptionStatus,
  type SubscriptionWithTierAndOrg
} from "@/types/subscription";
import { getCustomerOrganizationById } from "./customer-organization-service";
import {
  confirmCustomerSubscription,
  confirmCustomerSubscriptionCancellation,
  notifyOwnerOfNewSubscription,
  notifyOwnerOfSubscriptionCancellation
} from "./email-service";
import {
  cancelStripeSubscription,
  reactivateStripeSubscription
} from "./stripe/stripe-subscription-service";
import { getTierById } from "./tier/tier-service";
import { requireOrganization } from "./user-context-service";
import { getVendorOrganizationById } from "./vendor-organization-service";

/**
 * Get a subscription by its ID with related organization and tier data
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
 * Get all subscriptions for the current organization
 *
 * @returns Array of subscriptions
 */
export async function getSubscriptionsForCurrentOrganization() {
  const org = await requireOrganization();

  return await prisma.subscription.findMany({
    where: {
      organizationId: org.id
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

/**
 * Get all subscriptions for a specific organization
 */
export async function getOrganizationSubscriptions(organizationId: string) {
  return await prisma.subscription.findMany({
    where: {
      organizationId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

/**
 * Create a subscription for an organization
 */
export async function createSubscription(
  customerOrgId: string,
  tierId: string,
  stripeSubscriptionId: string,
  tierVersionId?: string
): Promise<Subscription> {
  const customerOrg = await getCustomerOrganizationById(customerOrgId);
  if (!customerOrg) throw new Error("Customer organization not found");

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
      organizationId: customerOrgId,
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
    throw new Error("Organization already has an active subscription to this tier");
  }

  // Deactivate any previous subscriptions for this organization-tier combination
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
      organizationId: customerOrgId,
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
    notifyOwnerOfNewSubscription(vendorOrg.owner.id, customerOrg.owner, tier.name),
    confirmCustomerSubscription(customerOrg.owner, tier.name)
  ]);

  return newSubscription;
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<Subscription> {
  const currentOrg = await requireOrganization();
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    include: {
      organization: {
        include: {
          owner: true
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

  // Check authorization - either the customer organization or the vendor organization
  const isCustomer = subscription.organizationId === currentOrg.id;
  const isVendor = subscription.tier.organizationId === currentOrg.id;

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
      subscription.organization!.owner,
      subscription.tier.name
    ),
    confirmCustomerSubscriptionCancellation(
      subscription.organization!.owner,
      subscription.tier.name
    )
  ]);

  return updatedSubscription;
}

/**
 * Get detailed subscription status for an organization and tier
 */
export async function getSubscriptionStatus(
  customerOrgId: string,
  tierId: string
): Promise<SubscriptionStatus> {
  if (!customerOrgId) {
    return {
      statusType: "not_subscribed",
      subscription: null,
      expiryDate: null
    };
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      organizationId: customerOrgId,
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
  const currentOrg = await requireOrganization();

  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    include: {
      organization: {
        include: {
          owner: true
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

  // Verify the organization is authorized
  if (subscription.organizationId !== currentOrg.id) {
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
    confirmCustomerSubscription(subscription.organization!.owner, subscription.tier.name),
    notifyOwnerOfNewSubscription(
      vendorOrg.owner.id,
      subscription.organization!.owner,
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
 * Get subscription history for the current organization and a specific tier
 */
export async function getSubscriptionHistory(tierId: string) {
  const org = await requireOrganization();
  return await prisma.subscription.findMany({
    where: {
      organizationId: org.id,
      tierId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}
