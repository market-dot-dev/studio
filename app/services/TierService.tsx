"use server";

import prisma from "@/lib/prisma";
import Tier, { newTier } from "@/app/models/Tier";
import StripeService, { SubscriptionCadence } from "./StripeService";
import UserService, { getCurrentUser } from "./UserService";
import { Feature, TierVersion, User } from "@prisma/client";
import SessionService from "./SessionService";
import FeatureService from "./feature-service";
import SubscriptionService from "./SubscriptionService";
import defaultTiers from "@/lib/constants/tiers/default-tiers";

export type TierWithFeatures = Tier & {
  features?: Feature[];
  _count?: { Charge: number; subscriptions: number };
};
export type TierVersionWithFeatures = TierVersion & { features?: Feature[] };
export type CheckoutType = "gitwallet" | "contact-us";

class TierService {
  static async destroyStripePrice(tier: Tier) {
    if (!tier.stripePriceId) {
      throw new Error("Tier does not have a Stripe price ID.");
    }

    const maintainer = await UserService.findUser(tier.userId);
    const stripeService = new StripeService(maintainer?.stripeAccountId!);
    await stripeService.destroyPrice(tier.stripePriceId);

    await prisma?.tier.update({
      where: { id: tier.id },
      data: { stripePriceId: null },
    });
  }

  static async updateApplicationFee(
    tierId: string,
    applicationFeePercent?: number,
    applicationFeePrice?: number,
  ) {
    const user = await getCurrentUser();
    if (!user?.roleId || user.roleId !== "admin") {
      throw new Error(
        "User does not have permission to update application fee percent.",
      );
    }

    return await prisma?.tier.update({
      where: { id: tierId },
      data: { applicationFeePercent, applicationFeePrice },
    });
  }

  static async findTier(id: string): Promise<Tier | null> {
    return prisma.tier.findUnique({
      where: {
        id,
      },
      include: {
        features: true,
        _count: {
          select: {
            Charge: true,
            subscriptions: true,
          },
        },
      },
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
        contractId: "gitwallet-msa",
      };

      const createdTier = await TierService.createTier(tier);

      return {
        success: true,
        id: createdTier.id,
      };
    } catch (error) {
      console.error("Error creating template tier", error);
    }
  }

  static async findTierByUserId(userId: string): Promise<Tier[]> {
    return prisma.tier.findMany({
      where: {
        userId,
      },
      include: {
        features: true,
      },
    });
  }

  static async toTierRow(tier: TierWithFeatures | Tier | Partial<Tier>) {
    const result = { ...tier } as any;
    delete result.id;
    delete result.features;
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
        "Tried to publish an existing tier, but the user has no connected stripe account.",
      );
    }

    const attrs = newTier({
      ...tierData,
      userId,
    }) as Partial<Tier>;

    if (user.stripeAccountId) {
      const stripeService = new StripeService(user.stripeAccountId);
      const product = await stripeService.createProduct(
        tierData.name,
        attrs.description || undefined,
      );
      const price = await stripeService.createPrice(
        product.id,
        attrs.price!,
        attrs.cadence as SubscriptionCadence,
      );
      attrs.stripeProductId = product.id;
      attrs.stripePriceId = price.id;
    }

    return await prisma.tier.create({
      data: attrs as Tier,
    });
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
            subscriptions: true,
            features: true,
          },
        },
      },
    });

    if (!tier) throw new Error(`Tier with ID ${id} not found`);

    if (
      tier._count?.Charge ||
      tier._count?.subscriptions ||
      tier._count?.features
    ) {
      throw new Error("Tier has existing charges, subscriptions or features");
    }

    return await prisma.tier.delete({
      where: { id },
    });
  }

  static async updateTier(
    id: string,
    tierData: Partial<Tier>,
    newFeatureIds?: string[],
  ) {
    // Ensure the current user is the owner of the tier or has permissions to update it
    const user = await UserService.getCurrentUser();

    if (!user) throw new Error("User not authenticated");

    const stripeService = new StripeService(user?.stripeAccountId!);

    let tier = await prisma.tier.findUnique({
      where: { id, userId: user.id },
      include: { versions: true },
    });

    if (!tier) throw new Error(`Tier with ID ${id} not found`);

    const attrs: Partial<Tier> = newTier({
      ...tier,
      ...tierData,
    });

    // console.debug("============= payload", { tierData, attrs });

    let newVersion: TierVersion | null = null;

    if (!attrs.name) {
      throw new Error("Tier name is required.");
    }

    if (!attrs.price) {
      throw new Error("Price is required.");
    }

    let newFeatureSetIds: string[] = newFeatureIds || [];
    const featuresChanged = newFeatureSetIds
      ? await FeatureService.haveFeatureIdsChanged(id, newFeatureSetIds)
      : false;

    const hasSubscribers = await SubscriptionService.hasSubscribers(
      id,
      tier.revision,
    );
    const cadenceChanged = attrs.cadence !== tier.cadence;
    const priceChanged = attrs.price !== tier.price || cadenceChanged;
    const annualPriceChanged = attrs.priceAnnual !== tier.priceAnnual;
    const materialChange =
      priceChanged || annualPriceChanged || featuresChanged;
    const createNewversion =
      hasSubscribers && attrs.published && materialChange;
    const stripeConnected = !!user.stripeAccountId;

    if (createNewversion) {
      newVersion = await prisma.tierVersion.create({
        data: {
          tierId: id,
          price: tier.price,
          stripePriceId: tier.stripePriceId,
          cadence: tier.cadence,
          priceAnnual: tier.priceAnnual,
          stripePriceIdAnnual: tier.stripePriceIdAnnual,
          revision: tier.revision,
        },
      });

      const existingFeatureSetIds = (await FeatureService.findByTierId(id)).map(
        (f) => f.id,
      );
      await FeatureService.setFeatureCollection(
        newVersion.id,
        existingFeatureSetIds,
        "tierVersion",
      );

      // clear old price from tier and version
      attrs.revision = tier.revision + 1;
      attrs.cadence = (attrs.cadence || "month") as SubscriptionCadence;

      const tierAttributes = {
        revision: tier.revision + 1,
      } as Partial<Tier>;

      if (featuresChanged || priceChanged) {
        attrs.stripePriceId = null;
        tierAttributes.stripePriceId = null;
      }

      if (featuresChanged || annualPriceChanged) {
        attrs.stripePriceIdAnnual = null;
        tierAttributes.stripePriceIdAnnual = null;
      }

      await prisma.tier.update({
        where: { id },
        data: tierAttributes,
      });
    } else {
      if (priceChanged && tier.stripePriceId) {
        attrs.stripePriceId = null;
        await stripeService.destroyPrice(tier.stripePriceId);
      }

      if (annualPriceChanged && tier.stripePriceIdAnnual) {
        attrs.stripePriceIdAnnual = null;
        await stripeService.destroyPrice(tier.stripePriceIdAnnual);
      }
    }

    await FeatureService.setFeatureCollection(id, newFeatureSetIds, "tier");

    if (stripeConnected && attrs.published) {
      if (!attrs.stripeProductId) {
        const product = await stripeService.createProduct(
          attrs.name,
          attrs.description || attrs.tagline || undefined,
        );
        attrs.stripeProductId = product.id;

        if (!attrs.stripeProductId) {
          throw new Error("Failed to create stripe product id.");
        }
      }

      if (!attrs.stripePriceId) {
        const price = await stripeService.createPrice(
          attrs.stripeProductId,
          attrs.price,
          attrs.cadence as SubscriptionCadence,
        );
        attrs.stripePriceId = price.id;
      }

      if (!attrs.stripePriceIdAnnual && attrs.priceAnnual) {
        const priceAnnual = await stripeService.createPrice(
          attrs.stripeProductId,
          attrs.priceAnnual,
          "year",
        );
        attrs.stripePriceIdAnnual = priceAnnual.id;
      }
    }

    const row = await TierService.toTierRow(attrs);
    // console.debug("============= updating", { tier, attrs, stripeConnected, createNewversion, priceChanged, row });

    return await prisma.tier.update({
      where: { id },
      data: row,
    });
  }

  static shouldCreateNewVersion = async (
    tier: Tier,
    tierData: Partial<Tier>,
  ): Promise<boolean> => {
    return (
      (tierData.published === true &&
        Number(tierData.price) !== Number(tier.price)) ||
      Number(tierData.priceAnnual) !== Number(tier.priceAnnual)
    );
  };

  static async findByUserId(userId: string) {
    return prisma.tier.findMany({
      where: {
        userId,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  }

  static async getVersionsByTierId(
    tierId: string,
  ): Promise<TierVersionWithFeatures[]> {
    return prisma.tierVersion.findMany({
      where: {
        tierId,
      },
      include: {
        features: true,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  }

  static async findByUserIdWithFeatures(
    userId: string,
  ): Promise<TierWithFeatures[]> {
    return prisma.tier.findMany({
      where: { userId },
      include: {
        features: true,
      },
      orderBy: [
        {
          published: "desc",
        },
      ],
    });
  }

  // this pulls published tiers to display on the front end site for customers to subscribe to
  static async getTiersForUser(userId: string, tierIds: string[] = []) {
    return prisma.tier.findMany({
      where: {
        userId,
        published: true,
        ...(tierIds.length > 0 && { id: { in: tierIds } }),
      },
      select: {
        id: true,
        name: true,
        tagline: true,
        description: true,
        createdAt: true,
        features: true,
        price: true,
        cadence: true,
        priceAnnual: true,
        versions: {
          orderBy: {
            createdAt: "desc", // Order by creation date in descending order
          },
          take: 1, // Take only the latest version
          include: {
            features: true, // Include the features of the latest version
          },
        },
      },
      orderBy: [
        {
          price: "asc",
        },
      ],
    });
  }
  // published tiers of the current admin
  static async getPublishedTiers(tierIds: string[] = []) {
    const userId = await SessionService.getCurrentUserId();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    return TierService.getTiersForUser(userId, tierIds);
  }

  // this pulls all tiers for the admin to manage
  static async getTiersForAdmin() {
    const userId = await SessionService.getCurrentUserId();

    if (!userId) {
      return {
        error: "Not authenticated",
      };
    }
    return prisma.tier.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        tagline: true,
        description: true,
        createdAt: true,
        versions: {
          orderBy: {
            createdAt: "desc", // Order by creation date in descending order
          },
          take: 1, // Take only the latest version
          include: {
            features: true, // Include the features of the latest version
          },
        },
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  }

  static async getCustomersOfUserTiers() {
    const userId = await SessionService.getCurrentUserId();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Retrieve all customers subscribed to the tiers owned by the logged-in user
    const customers = await prisma.user.findMany({
      where: {
        subscriptions: {
          some: {
            tier: {
              userId,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        subscriptions: {
          where: {
            tier: {
              userId,
            },
          },
          select: {
            createdAt: true,
            tierVersionId: true,
            tier: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return customers;
  }

  static async getLatestCustomers(numberOfRecords?: number, daysAgo?: number) {
    const userId = await SessionService.getCurrentUserId();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Calculate the date for filtering records from the last `daysAgo` days
    let dateFilter = undefined;
    if (daysAgo !== undefined) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - daysAgo);
      dateFilter = currentDate;
    }

    // Retrieve customers based on the provided parameters
    const customers = await prisma.user.findMany({
      where: {
        AND: [
          {
            subscriptions: {
              some: {
                tier: {
                  userId,
                },
                createdAt: dateFilter ? { gte: dateFilter } : undefined,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        subscriptions: {
          where: {
            tier: {
              userId,
            },
            createdAt: dateFilter ? { gte: dateFilter } : undefined,
          },
          select: {
            createdAt: true,
            tierVersionId: true,
            tier: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      take: numberOfRecords,
    });

    return customers;
  }

  static async getTiersForMatrix(tierId?: string): Promise<TierWithFeatures[]> {
    const currentUserId = await SessionService.getCurrentUserId();

    if (!currentUserId) {
      throw new Error("Not logged in");
    }

    let allTiers: TierWithFeatures[] =
      await TierService.findByUserIdWithFeatures(currentUserId);

    allTiers = allTiers.sort((a, b) => {
      if (tierId) {
        if (a.id === tierId) return -1;
        if (b.id === tierId) return 1;
      }
      return (a.price || 0) - (b.price || 0);
    });

    return allTiers;
  }

  // Add this new function to the TierService class

  static async duplicateTier(tierId: string) {
    const user = await UserService.getCurrentUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const originalTier = await prisma.tier.findUnique({
      where: { id: tierId },
      include: { features: true },
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
      contractId: originalTier.contractId,
    };

    try {
      // Create the new tier
      const createdTier = await TierService.createTier(newTierData);

      // Duplicate the features
      if (originalTier.features && originalTier.features.length > 0) {
        const featureIds = originalTier.features.map((feature) => feature.id);
        await FeatureService.setFeatureCollection(
          createdTier.id,
          featureIds,
          "tier",
        );
      }

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
  getCustomersOfUserTiers,
  getPublishedTiers,
  getTiersForMatrix,
  getTiersForUser,
  getVersionsByTierId,
  shouldCreateNewVersion,
  updateApplicationFee,
  updateTier,
  createTemplateTier,
  duplicateTier,
} = TierService;
