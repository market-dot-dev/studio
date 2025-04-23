"use server";

import Tier, { newTier } from "@/app/models/Tier";
import defaultTiers from "@/lib/constants/tiers/default-tiers";
import prisma from "@/lib/prisma";
import { Channel } from "@prisma/client";
import { updateServicesForSale } from "./MarketService";
import SessionService from "./session-service";
import StripeService, { SubscriptionCadence } from "./StripeService";
import { buildVersionContext, handlePriceUpdates, handleVersioning } from "./tier-version-service";
import UserService from "./UserService";

export type TierWithCount = Tier & {
  _count?: { Charge: number; subscriptions: number };
};
export type CheckoutType = "gitwallet" | "contact-form";

class TierService {
  static async findTier(id: string): Promise<Tier | null> {
    return prisma.tier.findUnique({
      where: {
        id
      },
      include: {
        _count: {
          select: {
            Charge: true,
            subscriptions: true
          }
        }
      }
    });
  }

  static async createTemplateTier(index?: number) {
    const tierIndex = index || 0;

    const defaultTier = defaultTiers[tierIndex]["data"];

    try {
      const tier = {
        ...defaultTier,
        published: false,
        revision: 0,
        contractId: "standard-msa"
      };

      const createdTier = await TierService.createTier(tier);

      return {
        success: true,
        id: createdTier.id
      };
    } catch (error) {
      console.error("Error creating template tier", error);
    }
  }

  static async findTierByUserId(userId: string): Promise<Tier[]> {
    return prisma.tier.findMany({
      where: {
        userId
      }
    });
  }

  static async toTierRow(tier: TierWithCount | Tier | Partial<Tier>) {
    const result = { ...tier } as any;
    delete result.id;
    delete result.versions;
    delete result._count;
    delete result.userId;
    delete result.createdAt;
    delete result.updatedAt;
    return result as Tier;
  }

  static async createTier(tierData: Partial<Tier>) {
    // Ensure the current user is the owner of the tier or has permissions to create it
    const user = await UserService.getCurrentUser();
    const userId = user?.id;

    if (!user) {
      throw new Error("User not authenticated");
    }

    if (!tierData.name) {
      throw new Error("Tier name is required.");
    }

    if (tierData.price === undefined) {
      throw new Error("Price is required.");
    }

    if (tierData.published && !user.stripeAccountId) {
      throw new Error(
        "Tried to publish an existing tier, but the user has no connected stripe account."
      );
    }

    const attrs = newTier({
      ...tierData,
      userId
    }) as Partial<Tier>;

    if (user.stripeAccountId) {
      const stripeService = new StripeService(user.stripeAccountId);
      const product = await stripeService.createProduct(
        tierData.name,
        attrs.description || undefined
      );
      const price = await stripeService.createPrice(
        product.id,
        attrs.price!,
        attrs.cadence as SubscriptionCadence
      );
      attrs.stripeProductId = product.id;
      attrs.stripePriceId = price.id;
    }

    // TODO: Consider wrapping the following block in a transaction
    const createdTier = await prisma.tier.create({
      data: attrs as Tier
    });

    if (user.marketExpertId) {
      await updateServicesForSale();
    }
    return createdTier;
  }

  static async destroyTier(id: string) {
    const user = await UserService.getCurrentUser();

    if (!user) throw new Error("User not authenticated");

    const tier = await prisma.tier.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            Charge: true,
            subscriptions: true
          }
        }
      }
    });

    if (!tier) throw new Error(`Tier with ID ${id} not found`);

    if (tier._count?.Charge || tier._count?.subscriptions) {
      throw new Error("Tier has existing charges or subscriptions");
    }

    const response = await prisma.tier.delete({
      where: { id }
    });

    if (user.marketExpertId) {
      await updateServicesForSale();
    }
    return response;
  }

  static async updateTier(id: string, tierData: Partial<Tier>) {
    const user = await TierService.validateUserAndGetTier(id);
    const tier = await TierService.findAndValidateTier(id, user.id);
    const attrs = TierService.prepareAttributes(tier, tierData);

    // Use the extracted version service to handle versioning context
    const versionContext = await buildVersionContext(tier, attrs);

    // Create a complete context with additional properties needed for tier updates
    const context = {
      ...versionContext,
      stripeConnected: !!user.stripeAccountId
    };

    if (tierData.checkoutType === "gitwallet") {
      if (context.createNewVersion) {
        // Use the extracted version service for handling version creation
        await handleVersioning(id, tier, attrs, context);
      } else {
        // Use the extracted version service for handling price updates
        if (context.stripeConnected) {
          await handlePriceUpdates(tier, attrs, user.stripeAccountId!, context);
        }
      }

      if (context.stripeConnected && attrs.published) {
        await TierService.handleStripeProducts(attrs, user.stripeAccountId!);
      }
    }

    const row = await TierService.toTierRow(attrs);
    const updatedTier = await prisma.tier.update({
      where: { id },
      data: row
    });

    if (user.marketExpertId) {
      await updateServicesForSale();
    }
    return updatedTier;
  }

  // Helper methods
  private static async validateUserAndGetTier(id: string) {
    const user = await UserService.getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    return user;
  }

  private static async findAndValidateTier(id: string, userId: string) {
    const tier = await prisma.tier.findUnique({
      where: { id, userId },
      include: { versions: true }
    });
    if (!tier) throw new Error(`Tier with ID ${id} not found`);
    return tier;
  }

  private static prepareAttributes(tier: Tier, tierData: Partial<Tier>) {
    const attrs: Partial<Tier> = newTier({ ...tier, ...tierData });
    if (!attrs.name) throw new Error("Tier name is required.");
    if (tierData.checkoutType === "gitwallet" && !attrs.price)
      throw new Error("Price is required.");
    return attrs;
  }

  private static async handleStripeProducts(attrs: Partial<Tier>, stripeAccountId: string) {
    const stripeService = new StripeService(stripeAccountId);

    if (!attrs.stripeProductId) {
      const product = await stripeService.createProduct(
        attrs.name!,
        attrs.description || attrs.tagline || undefined
      );
      attrs.stripeProductId = product.id;
      if (!attrs.stripeProductId) throw new Error("Failed to create stripe product id.");
    }

    if (!attrs.stripePriceId) {
      const price = await stripeService.createPrice(
        attrs.stripeProductId,
        attrs.price!,
        attrs.cadence as SubscriptionCadence
      );
      attrs.stripePriceId = price.id;
    }

    if (!attrs.stripePriceIdAnnual && attrs.priceAnnual) {
      const priceAnnual = await stripeService.createPrice(
        attrs.stripeProductId,
        attrs.priceAnnual,
        "year"
      );
      attrs.stripePriceIdAnnual = priceAnnual.id;
    }
  }

  static async findByUserId(userId: string) {
    return prisma.tier.findMany({
      where: {
        userId
      },
      orderBy: [
        {
          createdAt: "desc"
        }
      ]
    });
  }

  static async findByUserIdWithCount(userId: string): Promise<TierWithCount[]> {
    return prisma.tier.findMany({
      where: { userId },
      orderBy: [
        {
          published: "desc"
        }
      ]
    });
  }

  // this pulls published tiers to display on the front end site for customers to subscribe to
  static async getTiersForUser(userId: string, tierIds: string[] = [], channel?: Channel) {
    return prisma.tier.findMany({
      where: {
        userId,
        published: true,
        ...(tierIds.length > 0 && { id: { in: tierIds } }),
        ...(channel && { channels: { has: channel } })
      },
      select: {
        id: true,
        name: true,
        tagline: true,
        description: true,
        createdAt: true,
        price: true,
        cadence: true,
        priceAnnual: true,
        checkoutType: true,
        versions: {
          orderBy: {
            createdAt: "desc"
          },
          take: 1
        }
      },
      orderBy: [
        {
          price: "asc"
        }
      ]
    });
  }

  // published tiers of the current admin
  static async getPublishedTiers(tierIds: string[] = [], channel?: Channel) {
    const userId = await SessionService.getCurrentUserId();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    return TierService.getTiersForUser(userId, tierIds, channel);
  }

  static async duplicateTier(tierId: string) {
    const user = await UserService.getCurrentUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const originalTier = await prisma.tier.findUnique({
      where: { id: tierId }
    });

    if (!originalTier) {
      throw new Error(`Tier with ID ${tierId} not found`);
    }

    // Create a new tier object with the same data as the original
    const newTierData: Partial<Tier> = {
      name: `${originalTier.name} (Copy)`,
      published: false,
      price: originalTier.price,
      revision: 0,
      cadence: originalTier.cadence,
      userId: user.id,
      stripeProductId: null,
      description: originalTier.description,
      tagline: originalTier.tagline,
      applicationFeePercent: originalTier.applicationFeePercent,
      applicationFeePrice: originalTier.applicationFeePrice,
      stripePriceId: null,
      trialDays: originalTier.trialDays,
      priceAnnual: originalTier.priceAnnual,
      stripePriceIdAnnual: null,
      contractId: originalTier.contractId
    };

    try {
      // Create the new tier
      const createdTier = await TierService.createTier(newTierData);
      return createdTier;
    } catch (error) {
      console.error("Error duplicating tier:", error);
      throw error;
    }
  }
}

export default TierService;
export const {
  createTier,
  destroyTier,
  findTier,
  getPublishedTiers,
  getTiersForUser,
  updateTier,
  createTemplateTier,
  duplicateTier
} = TierService;
