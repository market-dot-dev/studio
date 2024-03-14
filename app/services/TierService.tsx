"use server";

import prisma from "@/lib/prisma";
import Tier, { newTier } from "@/app/models/Tier";
import StripeService from "./StripeService";
import UserService from "./UserService";
import { Feature, TierVersion } from "@prisma/client";
import ProductService from "./ProductService";
import SessionService from "./SessionService";
import FeatureService from "./feature-service";
import SubscriptionService from "./SubscriptionService";

export type TierWithFeatures = Tier & { features?: Feature[] };
export type TierVersionWithFeatures = TierVersion & { features?: Feature[]};

class TierService {
  static async createStripePrice(tier: Tier, newPrice: number) {
    const userId = await SessionService.getCurrentUserId();

    if(!userId) {
      throw new Error('User not authenticated');
    }

    let currentUser = await UserService.findUser(userId);

    if(!currentUser){
      throw new Error('User not found');
    }

    if(!currentUser.stripeProductId) {
      ProductService.createProduct(currentUser.id);
      currentUser = await UserService.findUser(userId);
      if(!currentUser?.stripeProductId) {
        throw new Error('Tried to attach a stripe product id to user, but failed.');
      }
    }

    if(tier.published && !currentUser.stripeAccountId) {
      throw new Error('Tried to publish a tier, but the user has no connected stripe account.');
    }

    const stripeProductId = currentUser?.stripeProductId;

    if(!stripeProductId) {
      throw new Error('User does not have a Stripe product ID.');
    }
    const newStripePrice = await StripeService.createPrice(stripeProductId, newPrice);

    await prisma?.tier.update({
      where: { id: tier.id },
      data: { stripePriceId: newStripePrice.id },
    });
  }

  static async destroyStripePrice(tier: Tier) {
    if(!tier.stripePriceId) {
      throw new Error('Tier does not have a Stripe price ID.');
    }

    await StripeService.destroyPrice(tier.stripePriceId);

    await prisma?.tier.update({
      where: { id: tier.id },
      data: { stripePriceId: null },
    });
  }

  static async findTier(id: string): Promise<Tier | null> {
    return prisma.tier.findUnique({
      where: {
        id,
      },
      include: {
        features: true,
      },
    });
  }

  static async createTier(tierData: Partial<Tier>) {
    // Ensure the current user is the owner of the tier or has permissions to create it
    const user = await UserService.getCurrentUser();
    const userId = user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    if(tierData.published && !user.stripeAccountId) {
      throw new Error('Tried to publish an existing tier, but the user has no connected stripe account.');
    }

    const tierAttributes = newTier({
      ...tierData,
      userId,
    }) as any;

    tierAttributes.price = parseFloat(`${tierAttributes.price}`);
    tierAttributes.userId = userId;
    tierAttributes.features = undefined;

    const tier = await prisma.tier.create({
      data: tierAttributes as Tier,
    });

    if(!user.stripeProductId) {
      ProductService.createProduct(user.id);
    }
    
    if(await StripeService.userCanSell(user)) {
      await TierService.createStripePrice(tier, parseFloat(`${tierAttributes.price}`));
    }

    return tier;
  }

  static async updateTier(id: string, tierData: Partial<Tier>, newFeatureIds?: string[]) {
    // Ensure the current user is the owner of the tier or has permissions to update it
    const userId = await SessionService.getCurrentUserId();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await UserService.findUser(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const tier = await prisma.tier.findUnique({
      where: { id },
    });

    if (!tier) {
      throw new Error(`Tier with ID ${id} not found`);
    }

    if (tier.userId !== userId) {
      throw new Error("User does not have permission to update this tier");
    }
    
    if(await StripeService.userCanSell(user) && !tier.stripePriceId) {
      await TierService.createStripePrice(tier, tier.price);
    }

    let newlyWrittenVersion: TierVersionWithFeatures | undefined;

    let existingFeatureSetIds: string[] = [];
    let newFeatureSetIds: string[] = newFeatureIds || [];

    const currentTier = await prisma.tier.findUnique({
      where: { id },
      include: { versions: true },
    });

    if (!currentTier) {
      throw new Error(`Tier with ID ${id} not found`);
    }

    const hasSubscribers = await SubscriptionService.hasSubscribers(id);
    const newPrice = parseFloat(`${tierData.price}`);
    const priceChanged = Number(tierData.price) !== Number(tier.price);
    const published = tierData.published === true;
    const featuresChanged = newFeatureSetIds ? (await FeatureService.haveFeatureIdsChanged(id, newFeatureSetIds)) : false;
    const materialChange = priceChanged || featuresChanged;

    if(hasSubscribers && published && materialChange){
      // create a new version and price
      // copy existing state to a version
      const newlyWrittenVersion = await prisma.tierVersion.create({
        data: {
          tierId: id,
          price: currentTier.price,
          stripePriceId: currentTier.stripePriceId,
          revision: currentTier.revision,
        },
      });

      // note the old feature ids so we can assign them (outside the transaction)
      existingFeatureSetIds = (await FeatureService.findByTierId(id)).map(f => f.id);

      // set the new price, and clear stripePriceId (as it belongs to version now)
      await prisma.tier.update({
        where: { id },
        data: {
          price: Number(tierData.price),
          stripePriceId: null,
          revision: currentTier.revision + 1
        },
      });

      // generate a new price id on the tier
      if (await StripeService.userCanSell(user)) {
        await TierService.createStripePrice(tier, newPrice);
      }
    } else {
      if(priceChanged) {
        if(tier.stripePriceId) {
          StripeService.destroyPrice(tier.stripePriceId);
        }

        console.log('~~updating with: ', {
          where: { id },
          data: {
            price: newPrice,
            stripePriceId: null,
          },
        });

        await prisma.tier.update({
          where: { id },
          data: {
            price: newPrice,
            stripePriceId: null,
          },
        });

        // generate a new price id on the tier
        if (await StripeService.userCanSell(user)) {
          await TierService.createStripePrice(tier, newPrice);
        }
      }
    }

    // update non-material columns
    const tierAttributes = tierData as any;
    delete tierAttributes.revision;
    delete tierAttributes.price;
    delete tierAttributes.id;
    delete tierAttributes.features;
    delete tierAttributes.stripePriceId;

    const writtenTier = await prisma.tier.update({
      where: { id },
      data: {
        ...(tierAttributes as Tier),
      },
    });

    if(!!newlyWrittenVersion){
      if(existingFeatureSetIds) {
        await FeatureService.setFeatureCollection(newlyWrittenVersion.id, existingFeatureSetIds, 'tierVersion');
      }
    }

    if(!!newFeatureSetIds) {
      await FeatureService.setFeatureCollection(tier.id, newFeatureSetIds, 'tier');
    }

    return writtenTier;
  }

  static shouldCreateNewVersion = async (tier: Tier, tierData: Partial<Tier>): Promise<boolean> => {
    return tierData.published === true && 
      Number(tierData.price) !== Number(tier.price);
  }

  static async findByUserId( userId: string) {
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

  static async getVersionsByTierId(tierId: string): Promise<TierVersionWithFeatures[]> {
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

  static async findByUserIdWithFeatures(userId: string): Promise<TierWithFeatures[]> {
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
  static async getTiersForUser( userId: string) {
    return prisma.tier.findMany({
      where: {
        userId,
        published: true
      },
      select: {
        id: true,
        name: true,
        tagline: true,
        description: true,
        createdAt: true,
        features: true,
        price: true,
        versions: {
          orderBy: {
            createdAt: 'desc' // Order by creation date in descending order
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
        userId
      },
      select: {
        id: true,
        name: true,
        tagline: true,
        description: true,
        createdAt: true,
        versions: {
          orderBy: {
            createdAt: 'desc' // Order by creation date in descending order
          },
          take: 1, // Take only the latest version
          include: {
            features: true, // Include the features of the latest version
          },
        }
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
              userId
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
              userId
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
                  userId
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
              userId
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

    let allTiers: TierWithFeatures[] = await TierService.findByUserIdWithFeatures(currentUserId);

    allTiers = allTiers.sort((a, b) => {
      if(tierId){
        if (a.id === tierId) return -1;
        if (b.id === tierId) return 1;
      }
      return a.price - b.price;
    });

    return allTiers;
  }
};

export const createStripePriceById = async (id: string) => {
  const tier = await TierService.findTier(id);
  if(!tier) {
    throw new Error('Tier not found.');
  }

  await TierService.createStripePrice(tier, tier.price);
}

export const destroyStripePriceById = async (id: string) => {
  const tier = await TierService.findTier(id);
  if(!tier) {
    throw new Error('Tier not found.');
  }

  await TierService.destroyStripePrice(tier);
}

export default TierService;
export const { findTier, updateTier, createTier, createStripePrice, destroyStripePrice, getCustomersOfUserTiers, getTiersForMatrix, shouldCreateNewVersion, getVersionsByTierId, getTiersForUser } = TierService;