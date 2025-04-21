"use server";

import Tier, { newTier } from "@/app/models/Tier";
import defaultTiers from "@/lib/constants/tiers/default-tiers";
import prisma from "@/lib/prisma";
import { Channel, User } from "@prisma/client";
import { updateServicesForSale } from "./MarketService";
import SessionService from "./SessionService";
import StripeService, { SubscriptionCadence } from "./StripeService";
import SubscriptionService from "./SubscriptionService";
import UserService, { getCurrentUser } from "./UserService";

export type TierWithCount = Tier & {
  _count?: { Charge: number; subscriptions: number };
};
export type CheckoutType = "gitwallet" | "contact-form";

class TierService {
  static async destroyStripePrice(tier: Tier) {
    if (!tier.stripePriceId) {
      throw new Error("Tier does not have a Stripe price ID.");
    }

    const maintainer = await UserService.findUser(tier.userId);
    if (!maintainer || !maintainer.stripeAccountId) {
      throw new Error("Maintainer not found for this tier.");
    }
    const stripeService = new StripeService(maintainer.stripeAccountId);
    await stripeService.destroyPrice(tier.stripePriceId);

    await prisma?.tier.update({
      where: { id: tier.id },
      data: { stripePriceId: null }
    });
  }

  static async updateApplicationFee(
    tierId: string,
    applicationFeePercent?: number,
    applicationFeePrice?: number
  ) {
    const user = await getCurrentUser();
    if (!user?.roleId || user.roleId !== "admin") {
      throw new Error("User does not have permission to update application fee percent.");
    }

    return await prisma?.tier.update({
      where: { id: tierId },
      data: { applicationFeePercent, applicationFeePrice }
    });
  }

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

    const context = await TierService.buildUpdateContext(user, tier, attrs);

    if (tierData.checkoutType === "gitwallet") {
      if (context.createNewVersion) {
        await TierService.handleVersioning(id, tier, attrs, context);
      } else {
        await TierService.handlePriceUpdates(user, tier, attrs, context);
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

  private static async buildUpdateContext(user: User, tier: Tier, attrs: Partial<Tier>) {
    const hasSubscribers = await SubscriptionService.hasSubscribers(tier.id, tier.revision);
    const cadenceChanged = attrs.cadence !== tier.cadence;
    const priceChanged = attrs.price !== tier.price || cadenceChanged;
    const annualPriceChanged = attrs.priceAnnual !== tier.priceAnnual;

    return {
      hasSubscribers,
      priceChanged,
      annualPriceChanged,
      materialChange: priceChanged || annualPriceChanged,
      createNewVersion: hasSubscribers && attrs.published && (priceChanged || annualPriceChanged),
      stripeConnected: !!user.stripeAccountId
    };
  }

  private static async handleVersioning(
    id: string,
    tier: Tier,
    attrs: Partial<Tier>,
    context: any
  ) {
    const newVersion = await prisma.tierVersion.create({
      data: {
        tierId: id,
        price: tier.price,
        stripePriceId: tier.stripePriceId,
        cadence: tier.cadence,
        priceAnnual: tier.priceAnnual,
        stripePriceIdAnnual: tier.stripePriceIdAnnual,
        revision: tier.revision
      }
    });

    attrs.revision = tier.revision + 1;
    attrs.cadence = (attrs.cadence || "month") as SubscriptionCadence;

    const tierAttributes = TierService.buildTierAttributes(tier, attrs, context);
    await prisma.tier.update({ where: { id }, data: tierAttributes });
  }

  private static async handlePriceUpdates(
    user: User,
    tier: Tier,
    attrs: Partial<Tier>,
    context: any
  ) {
    const stripeService = new StripeService(user.stripeAccountId!);

    if (context.priceChanged && tier.stripePriceId) {
      attrs.stripePriceId = null;
      await stripeService.destroyPrice(tier.stripePriceId);
    }

    if (context.annualPriceChanged && tier.stripePriceIdAnnual) {
      attrs.stripePriceIdAnnual = null;
      await stripeService.destroyPrice(tier.stripePriceIdAnnual);
    }
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

  private static buildTierAttributes(tier: Tier, attrs: Partial<Tier>, context: any) {
    const tierAttributes = {
      revision: tier.revision + 1
    } as Partial<Tier>;

    if (context.priceChanged) {
      attrs.stripePriceId = null;
      tierAttributes.stripePriceId = null;
    }

    if (context.annualPriceChanged) {
      attrs.stripePriceIdAnnual = null;
      tierAttributes.stripePriceIdAnnual = null;
    }

    return tierAttributes;
  }

  static shouldCreateNewVersion = async (tier: Tier, tierData: Partial<Tier>): Promise<boolean> => {
    return (
      (tierData.published === true && Number(tierData.price) !== Number(tier.price)) ||
      Number(tierData.priceAnnual) !== Number(tier.priceAnnual)
    );
  };

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

  static async getVersionsByTierId(tierId: string) {
    return prisma.tierVersion.findMany({
      where: {
        tierId
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

  static async getTiersForMatrix(tierId?: string): Promise<TierWithCount[]> {
    const currentUserId = await SessionService.getCurrentUserId();

    if (!currentUserId) {
      throw new Error("Not logged in");
    }

    let allTiers: TierWithCount[] = await TierService.findByUserIdWithCount(currentUserId);

    allTiers = allTiers.sort((a, b) => {
      if (tierId) {
        if (a.id === tierId) return -1;
        if (b.id === tierId) return 1;
      }
      return (a.price || 0) - (b.price || 0);
    });

    return allTiers;
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
  destroyStripePrice,
  destroyTier,
  findTier,
  getPublishedTiers,
  getTiersForMatrix,
  getTiersForUser,
  getVersionsByTierId,
  shouldCreateNewVersion,
  updateApplicationFee,
  updateTier,
  createTemplateTier,
  duplicateTier
} = TierService;
