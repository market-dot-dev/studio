"use server";

import prisma from "@/lib/prisma";
import { Charge } from "@prisma/client";
import { getStripeCustomerId } from "./customer-service";
import EmailService from "./EmailService";
import SessionService from "./SessionService";
import TierService from "./tier-service";
import UserService from "./UserService";

class ChargeService {
  static async findCharge(chargeId: string): Promise<Charge | null> {
    return prisma.charge.findUnique({
      where: {
        id: chargeId
      },
      include: {
        user: true,
        tier: true
      }
    });
  }

  static async chargeCount(tierId: string, revision?: number): Promise<number> {
    return prisma.charge.count({
      where: {
        tierId: tierId,
        tierRevision: revision ? revision : undefined
      }
    });
  }

  static async hasCharges(tierId: string, revision?: number): Promise<boolean> {
    const subscriptions = await prisma.charge.findMany({
      where: {
        tierId: tierId,
        tierRevision: revision ? revision : undefined
      }
    });

    return subscriptions.length > 0;
  }

  static async anyChargesByTierId(tierId: string): Promise<boolean> {
    return !!(await ChargeService.findChargesByTierId(tierId));
  }

  static async findChargesByTierId(tierId: string): Promise<Charge[] | null> {
    const userId = await SessionService.getCurrentUserId();

    if (!userId) return null;

    return prisma.charge.findMany({
      where: {
        tierId,
        userId: userId
      }
    });
  }

  static async findCharges(): Promise<Charge[]> {
    const userId = await SessionService.getCurrentUserId();
    if (!userId) return [];

    return prisma.charge.findMany({
      where: {
        userId: userId
      }
    });
  }

  static async chargedByUser(userId: string): Promise<Charge[]> {
    return prisma.charge.findMany({
      where: {
        userId: userId
      },
      include: {
        user: true,
        tier: true
      }
    });
  }

  static async createLocalCharge(
    userId: string,
    tierId: string,
    paymentIntentId: string,
    tierVersionId?: string
  ): Promise<Charge> {
    const user = await UserService.findUser(userId);
    if (!user) throw new Error("User not found");

    const tier = await TierService.findTier(tierId);
    if (!tier) throw new Error("Tier not found");
    if (tier.cadence !== "once") throw new Error("Tier is not a one-time purchase");
    if (!tier.stripePriceId) throw new Error("Stripe price ID not found for tier");

    const maintainer = await UserService.findUser(tier.userId);
    if (!maintainer) throw new Error("Maintainer not found");
    if (!maintainer.stripeAccountId)
      throw new Error("Maintainer's account not connected to Stripe");

    const stripeCustomerId = await getStripeCustomerId(user, maintainer.stripeAccountId);
    if (!stripeCustomerId) throw new Error("Stripe customer ID not found for user");

    /*
    // allowing users to purchase the same tier more than once
    const existingCharge = await ChargeService.findChargeByTierId(tierId);
    if(existingCharge) throw new Error('User has already bought this tier');
    */

    const res = await prisma.charge.create({
      data: {
        userId: userId,
        tierId: tierId,
        tierVersionId: tierVersionId,
        stripeChargeId: paymentIntentId,
        tierRevision: tier.revision
      }
    });

    await Promise.all([
      // FIXME -- implement charge emails
      // send email to the tier owner
      EmailService.newPurchaseInformation(tier.userId, user, tier.name),
      // send email to the customer
      EmailService.newPurchaseConfirmation(user, tier.name)
    ]);

    return res;
  }
}

export const {
  createLocalCharge,
  findChargesByTierId,
  findCharge,
  findCharges,
  anyChargesByTierId,
  hasCharges,
  chargeCount
} = ChargeService;
export default ChargeService;
