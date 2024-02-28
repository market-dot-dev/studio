"use server";

import prisma from "@/lib/prisma";
import StripeService from "./StripeService";
import UserService from "./UserService";

import { Subscription, Tier, User } from "@prisma/client";
import TierService from "./TierService";
import EmailService from "./EmailService";
import SessionService from "./SessionService";

export type SubscriptionWithUser = Subscription & { user: User, tier?: Tier};

class SubscriptionService {
  static async findSubscription(subscriptionId: string): Promise<SubscriptionWithUser | null> {
    return prisma.subscription.findUnique({
      where: {
        id: subscriptionId,
      },
      include: {
        user: true,
        tier: true,
      },
    });
  }

  static async hasSubscribers(tierId: string): Promise<boolean> {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        tierId: tierId,
      }
    });

    return subscriptions.length > 0;
  }

  static async findSubscriptionByTierId({ tierId }: { tierId: string; }): Promise<Subscription | null> {
    const userId = await SessionService.getCurrentUserId();
    
    if(!userId) return null;

    const subscription = await prisma.subscription.findUnique({
      where: {
        userId_tierId: {
          tierId,
          userId: userId,
        },
      }
    });

    return subscription;
  }

  static async findSubscriptions(): Promise<Subscription[]> {
    const userId = await SessionService.getCurrentUserId();
    if(!userId) return [];

    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: userId,
      }
    });

    return subscriptions;
  }

  static async subscribedToUser(userId: string): Promise<SubscriptionWithUser[]> {
    return prisma.subscription.findMany({
      where: {
        tier: {
          userId: userId,
        },
      },
      include: {
        user: true,
        tier: true,
      },
    });
  }

  // Create a subscription for a user
  static async createSubscription(userId: string, tierId: string, tierVersionId?: string) {
    const user = await UserService.findUser(userId);
    if (!user) throw new Error('User not found');

    const stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) throw new Error('Stripe customer ID not found for user');

    const tier = await TierService.findTier(tierId);
    if (!tier) throw new Error('Tier not found');
    if (!tier.stripePriceId) throw new Error('Stripe price ID not found for tier');

    const subscription = await StripeService.createSubscription(stripeCustomerId, tier.stripePriceId);
    const res = await prisma.subscription.create({
      data: {
        userId: userId,
        tierId: tierId,
        tierVersionId: tierVersionId,
        stripeSubscriptionId: subscription.id,
      },
    });

    await Promise.all([
      // send email to the tier owner
      EmailService.newSubscriptionInformation(tier.userId, user, tier.name),
      // send email to the customer
      EmailService.newSubscriptionConfirmation(user, tier.name)
    ]);

    return res;
  }

  // Cancel or destroy a subscription
  static async destroySubscription(subscriptionId: string) {
    // const subscription = await prisma.subscription.findUnique({ where: { id: subscriptionId } });
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        user: true, // customer
        tier: {
          select: {
            name: true,
            user: true, // tier owner
          },
        },
      },
    });
    if (!subscription) throw new Error('Subscription not found');

    await StripeService.destroySubscription(subscription.stripeSubscriptionId);
    await prisma.subscription.delete({ where: { id: subscriptionId } });
    
    await Promise.all([
      // inform the tier owner
      subscription?.tier?.user ? EmailService.subscriptionCancelledInfo(subscription?.tier?.user, subscription.user, subscription?.tier?.name) : null,
      // inform the customer
      subscription.user ? EmailService.subscriptionCancelledConfirmation(subscription.user,  subscription?.tier?.name ?? '') : null,
    ])
  }

  // Update a subscription (change tier, for example)
  static async updateSubscription(subscriptionId: string, newTierId: string) {
    const subscription = await prisma.subscription.findUnique({ where: { id: subscriptionId } });
    if (!subscription) throw new Error('Subscription not found');

    await StripeService.updateSubscription(subscription.stripeSubscriptionId, newTierId);
    return await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { tierId: newTierId },
    });
  }

  static async isSubscribed(userId: string, tierId: string): Promise<boolean> {
    const subscription = await prisma.subscription.findFirst({
      where: { userId: userId, tierId: tierId },
    });

    return !!subscription;
  }

  // Check if a user can subscribe to a tier (e.g., not already subscribed)
  static async canSubscribe(userId: string, tierId: string): Promise<boolean> {
    const existingSubscription = await prisma.subscription.findFirst({
      where: { userId: userId, tierId: tierId },
    });
    
    return !existingSubscription;
  }
};

export const { createSubscription, destroySubscription, findSubscriptionByTierId, findSubscription, findSubscriptions, updateSubscription, canSubscribe, isSubscribed, hasSubscribers } = SubscriptionService;
export default SubscriptionService;