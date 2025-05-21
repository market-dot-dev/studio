"use server";

import { Charge } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { confirmCustomerPurchase, notifyOwnerOfNewPurchase } from "./email-service";
import { getStripeCustomerId } from "./organization-customer-service";
import { getTierByIdWithOrg } from "./tier/tier-service";
import { requireUserSession } from "./user-context-service";
import UserService from "./UserService";

class ChargeService {
  static async findCharge(chargeId: string): Promise<Charge | null> {
    return prisma.charge.findUnique({
      where: {
        id: chargeId
      },
      include: {
        user: true, // @TODO: Should be an Org
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
    const user = await requireUserSession(); // @TODO: Should be an Org
    return prisma.charge.findMany({
      where: {
        tierId,
        userId: user.id
      }
    });
  }

  static async findCharges(): Promise<Charge[]> {
    const user = await requireUserSession(); // @TODO: Should be an Org
    return prisma.charge.findMany({
      where: {
        userId: user.id
      }
    });
  }

  // @TODO: Should be an Org
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
    customerId: string,
    tierId: string,
    paymentIntentId: string,
    tierVersionId?: string
  ): Promise<Charge> {
    const customer = await UserService.findUser(customerId); // @TODO: Should be an Org
    if (!customer) throw new Error("User not found");

    const tier = await getTierByIdWithOrg(tierId);
    if (!tier || !tier.organization || !tier.organization.stripeAccountId)
      throw new Error("Tier not valid");

    if (tier.cadence !== "once") throw new Error("Tier is not a one-time purchase");
    if (!tier.stripePriceId) throw new Error("Stripe price ID not found for tier");

    const stripeCustomerId = await getStripeCustomerId(customer, tier.organization.stripeAccountId); // @TODO: Should be an Org
    if (!stripeCustomerId) throw new Error("Stripe customer ID not found for user");

    /*
    // allowing users to purchase the same tier more than once
    const existingCharge = await ChargeService.findChargeByTierId(tierId);
    if(existingCharge) throw new Error('User has already bought this tier');
    */

    const res = await prisma.charge.create({
      data: {
        userId: customerId,
        tierId: tierId,
        tierVersionId: tierVersionId,
        stripeChargeId: paymentIntentId,
        tierRevision: tier.revision
      }
    });

    await Promise.all([
      // FIXME -- implement charge emails
      // send email to the tier owner
      notifyOwnerOfNewPurchase(tier.organization.ownerId, customer, tier.name),
      // send email to the customer
      confirmCustomerPurchase(customer, tier.name)
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
