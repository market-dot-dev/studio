"use server";

import prisma from "@/lib/prisma";
import Tier, { newTier } from "@/app/models/Tier";
import StripeService from "./StripeService";
import UserService from "./UserService";
import { Feature, TierVersion } from "@prisma/client";
import SessionService from "./SessionService";
import FeatureService from "./feature-service";
import SubscriptionService from "./SubscriptionService";

export type TierWithFeatures = Tier & { features?: Feature[] };
export type TierVersionWithFeatures = TierVersion & { features?: Feature[]};

class TierService {
  static async destroyStripePrice(tier: Tier) {
    if(!tier.stripePriceId) {
      throw new Error('Tier does not have a Stripe price ID.');
    }

    const maintainer = await UserService.findUser(tier.userId);
    const stripeService = new StripeService(maintainer?.stripeAccountId!);
    await stripeService.destroyPrice(tier.stripePriceId);

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
    const stripeAccountId = user?.stripeAccountId;

    if (!user) {
      throw new Error("User not authenticated");
    }

    if(tierData.published && !user.stripeAccountId) {
      throw new Error('Tried to publish an existing tier, but the user has no connected stripe account.');
    }

    const attrs = newTier({
      ...tierData,
      userId,
    }) as any;

    attrs.price = parseFloat(`${attrs.price}`);
    attrs.features = undefined;

    if(user.stripeAccountId){
      const stripeService = new StripeService(user.stripeAccountId);
      const product = await stripeService.createProduct(attrs.name, attrs.description || undefined);
      const price = await stripeService.createPrice(product.id, attrs.price);
      attrs.stripeProductId = product.id;
      attrs.stripePriceId = price.id;
    }

    return await prisma.tier.create({
      data: attrs as Tier,
    });
  }

  static async updateTier(id: string, tierData: Partial<Tier>, newFeatureIds?: string[]) {
    // Ensure the current user is the owner of the tier or has permissions to update it
    const user = await UserService.getCurrentUser();

    if (!user) throw new Error("User not authenticated");

    const stripeService = new StripeService(user?.stripeAccountId!);

    let tier = await prisma.tier.findUnique({
      where: { id, userId: user.id},
      include: { versions: true }
    });

    if (!tier) throw new Error(`Tier with ID ${id} not found`);
    
    if(user.stripeAccountId){
      if(!tier.stripeProductId) {
        const product = await stripeService.createProduct(tier.name, tier.description || undefined);
        tier.stripeProductId = product.id;

        await prisma.tier.update({
          where: { id },
          data: { stripeProductId: product.id },
        });
      }
    }

    let newFeatureSetIds: string[] = newFeatureIds || [];

    const hasSubscribers = await SubscriptionService.hasSubscribers(id, tier.revision);
    const newPrice = parseFloat(`${tierData.price}`);
    const priceChanged = Number(tierData.price) !== Number(tier.price);
    const published = tierData.published === true;
    const featuresChanged = newFeatureSetIds ? (await FeatureService.haveFeatureIdsChanged(id, newFeatureSetIds)) : false;
    const materialChange = priceChanged || featuresChanged;
    const createNewversion = hasSubscribers && published && materialChange;
    const stripeConnected = !!user.stripeAccountId;

    if(createNewversion){
      const newVersion = await prisma.tierVersion.create({
        data: {
          tierId: id,
          price: tier.price,
          stripePriceId: tier.stripePriceId,
          revision: tier.revision,
        },
      });

      const existingFeatureSetIds = (await FeatureService.findByTierId(id)).map(f => f.id);
      await FeatureService.setFeatureCollection(newVersion.id, existingFeatureSetIds, 'tierVersion');
      await FeatureService.setFeatureCollection(id, newFeatureSetIds, 'tier');

      // set the new price, and clear stripePriceId (as it belongs to version now)
      await prisma.tier.update({
        where: { id },
        data: {
          price: Number(tierData.price),
          stripePriceId: null,
          revision: tier.revision + 1
        },
      });
    } else {
      if(priceChanged) {
        if(tier.stripePriceId) {
          await stripeService.destroyPrice(tier.stripePriceId);
        }
      }
    }

    if(stripeConnected && (createNewversion || priceChanged)) {
      const price = await stripeService.createPrice(tier.stripeProductId!, newPrice);

      await prisma.tier.update({
        where: { id },
        data: {
          stripePriceId: price.id,
        },
      });
    }

    // update non-material columns
    const tierAttributes = tierData as any;
    delete tierAttributes.revision;
    delete tierAttributes.price;
    delete tierAttributes.id;
    delete tierAttributes.features;
    delete tierAttributes.stripePriceId;

    return await prisma.tier.update({
      where: { id },
      data: {
        ...(tierAttributes as Tier),
      },
    });
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

export default TierService;
export const { findTier, updateTier, createTier, destroyStripePrice, getCustomersOfUserTiers, getTiersForMatrix, shouldCreateNewVersion, getVersionsByTierId, getTiersForUser } = TierService;