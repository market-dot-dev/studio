"use server";

import { User } from "@prisma/client";
import StripeService from "./StripeService";
import TierService from "./TierService";
import prisma from "@/lib/prisma";

class MigrationService {
  static async migrateUser(user: User) {
    if(!user.stripeAccountId) {
      throw new Error("User does not have a connected stripe account");
    }

    const tiers = await TierService.findByUserId(user.id);

    /*
    const legacyProducts = await prisma.legacyProduct.findMany({
      where: {
        maintainerUserId: user.id,
      },
      include: {
        maintainer: true,
        tier: true,
        subscription: {
          include: {
            tier: true,
            user: true,
          }
        },
      }
    });
    */

    const stripeService = new StripeService(user.stripeAccountId);

    for(const tier of tiers) {
      // create a new product and price on the connected account
      if(!tier.stripeProductId) {
        const product = await stripeService.createProduct(tier.name, tier.description || undefined);
        const price = await stripeService.createPrice(product.id, tier.price);
        
        await prisma.tier.update({
          where: { id: tier.id },
          data: {
            stripeProductId: product.id,
            stripePriceId: price.id,
          }
        });
      }
    }
  }
};

export default MigrationService;