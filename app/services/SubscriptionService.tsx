"use server";

import prisma from "@/lib/prisma";
import Product from "@/app/models/Product";
import StripeService from "./StripeService";
import UserService from "./UserService";

import { Subscription } from "@prisma/client";
import TierService from "./TierService";

class SubscriptionService {
  static async findSubscription({ tierId }: { tierId: string; }): Promise<Subscription | null> {
    const userId = await UserService.getCurrentUserId();
    
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
    return await prisma.subscription.create({
      data: {
        userId: userId,
        tierId: tierId,
        tierVersionId: tierVersionId,
        stripeSubscriptionId: subscription.id,
      },
    });
  }

  // Cancel or destroy a subscription
  static async destroySubscription(subscriptionId: string) {
    const subscription = await prisma.subscription.findUnique({ where: { id: subscriptionId } });
    if (!subscription) throw new Error('Subscription not found');

    await StripeService.destroySubscription(subscription.stripeSubscriptionId);
    await prisma.subscription.delete({ where: { id: subscriptionId } });
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

export const { createSubscription, destroySubscription, findSubscription, updateSubscription, canSubscribe } = SubscriptionService;