"use server";

import prisma from "@/lib/prisma";
import { Subscription as SubscriptionSql } from "@prisma/client";
import Subscription, { SubscriptionStates, SubscriptionWithUser } from "../models/Subscription";
import { getStripeCustomerId } from "./customer-service";
import EmailService from "./EmailService";
import SessionService from "./session-service";
import StripeService from "./StripeService";
import TierService from "./tier-service";
import UserService from "./UserService";

class SubscriptionService {
  static async findSubscription(subscriptionId: string): Promise<Subscription | null> {
    const subscription = await prisma.subscription.findUnique({
      where: {
        id: subscriptionId
      },
      include: {
        user: true,
        tier: true
      }
    });

    return subscription ? new Subscription(subscription) : null;
  }

  static async findActiveSubscription(
    subscriptionId: string
  ): Promise<SubscriptionWithUser | null> {
    const currentDate = new Date();
    return prisma.subscription.findUnique({
      where: {
        id: subscriptionId,
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
      },
      include: {
        user: true,
        tier: true
      }
    });
  }

  static async subscriberCount(tierId: string, revision?: number): Promise<number> {
    return prisma.subscription.count({
      where: {
        tierId: tierId,
        tierRevision: revision ? revision : undefined
      }
    });
  }

  static async hasSubscribers(tierId: string, revision?: number): Promise<boolean> {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        tierId: tierId,
        tierRevision: revision ? revision : undefined
      }
    });

    return subscriptions.length > 0;
  }

  static async findSubscriptionByTierId({
    tierId
  }: {
    tierId: string;
  }): Promise<Subscription | null> {
    const userId = await SessionService.getCurrentUserId();

    if (!userId) return null;

    const subscription = await prisma.subscription.findUnique({
      where: {
        userId_tierId: {
          tierId,
          userId: userId
        }
      }
    });

    return subscription ? new Subscription(subscription) : null;
  }

  static async findSubscriptions(): Promise<Subscription[]> {
    const userId = await SessionService.getCurrentUserId();
    if (!userId) return [];

    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: userId
      }
    });

    return subscriptions.map((subscription) => new Subscription(subscription));
  }

  static async subscribedToUser(userId: string): Promise<SubscriptionWithUser[]> {
    const currentDate = new Date();
    return prisma.subscription.findMany({
      where: {
        OR: [
          {
            state: SubscriptionStates.renewing,
            tier: {
              userId: userId
            }
          },
          {
            state: SubscriptionStates.cancelled,
            activeUntil: {
              gt: currentDate
            },
            tier: {
              userId: userId
            }
          }
        ]
      },
      include: {
        user: true,
        tier: true
      }
    });
  }

  // Create a subscription for a user
  static async createSubscription(
    userId: string,
    tierId: string,
    stripeSubscriptionId: string,
    tierVersionId?: string
  ) {
    const user = await UserService.findUser(userId);
    if (!user) throw new Error("User not found");

    const tier = await TierService.findTier(tierId);
    if (!tier) throw new Error("Tier not found");
    if (!tier.stripePriceId) throw new Error("Stripe price ID not found for tier");

    const maintainer = await UserService.findUser(tier.userId);
    if (!maintainer) throw new Error("Maintainer not found");
    if (!maintainer.stripeAccountId)
      throw new Error("Maintainer's account not connected to Stripe");

    const stripeCustomerId = await getStripeCustomerId(user, maintainer.stripeAccountId);
    if (!stripeCustomerId) throw new Error("Stripe customer ID not found for user");

    const existingSubscription = await SubscriptionService.findSubscriptionByTierId({ tierId });

    let res: SubscriptionSql | null = null;

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

    if (existingSubscription) {
      res = await prisma.subscription.update({
        where: {
          id: existingSubscription.id
        },
        data: attributes
      });
    } else {
      res = await prisma.subscription.create({
        data: attributes
      });
    }

    await Promise.all([
      // send email to the tier owner
      EmailService.newSubscriptionInformation(tier.userId, user, tier.name),
      // send email to the customer
      EmailService.newSubscriptionConfirmation(user, tier.name)
    ]);

    return res;
  }

  // Cancel or destroy a subscription
  static async cancelSubscription(subscriptionId: string) {
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

    const stripeSubscription = await StripeService.cancelSubscription(
      subscription.stripeSubscriptionId,
      maintainer.stripeAccountId
    );

    await prisma.subscription.update({
      data: {
        state: SubscriptionStates.cancelled,
        cancelledAt: new Date(),
        activeUntil: new Date(stripeSubscription.current_period_end * 1000)
      },
      where: {
        id: subscriptionId
      }
    });

    await Promise.all([
      // inform the tier owner
      subscription?.tier?.user
        ? EmailService.subscriptionCancelledInfo(
            subscription?.tier?.user,
            subscription.user,
            subscription?.tier?.name
          )
        : null,
      // inform the customer
      subscription.user
        ? EmailService.subscriptionCancelledConfirmation(
            subscription.user,
            subscription?.tier?.name ?? ""
          )
        : null
    ]);
  }

  static async updateSubscription(subscriptionId: string, attributes: Partial<SubscriptionSql>) {
    return await prisma.subscription.update({
      where: {
        id: subscriptionId
      },
      data: attributes
    });
  }

  static async isSubscribedByTierId(userId: string, tierId: string): Promise<boolean> {
    const currentDate = new Date();
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: userId,
        tierId: tierId,
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

    return subscription ? new Subscription(subscription).isRenewing() : false;
  }

  // Check if a user can subscribe to a tier (e.g., not already subscribed)
  static async canSubscribe(userId: string, tierId: string): Promise<boolean> {
    return !(await SubscriptionService.isSubscribedByTierId(userId, tierId));
  }
}

export const {
  createSubscription,
  cancelSubscription,
  findSubscriptionByTierId,
  findSubscription,
  findSubscriptions,
  updateSubscription,
  canSubscribe,
  isSubscribedByTierId,
  hasSubscribers,
  subscriberCount
} = SubscriptionService;
export default SubscriptionService;
