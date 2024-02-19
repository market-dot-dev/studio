"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import Tier, { newTier } from "@/app/models/Tier";
import StripeService from "./StripeService";
import UserService from "./UserService";
import { Feature } from "@prisma/client";
import ProductService from "./ProductService";
import FeatureService from "./feature-service";

export type TierWithFeatures = Tier & { features?: Feature[] };

class TierService {
  static async createStripePrice(tier: Tier) {
    const session = await getSession();
    const userId = session?.user.id;

    if(!userId) {
      throw new Error('User not authenticated');
    }

    let currentUser = await UserService.findUser(userId);

    if(!currentUser){
      throw new Error('User not found');
    }

    if(!currentUser.stripeProductId) {
      ProductService.createProduct(currentUser.id);
      currentUser = await UserService.findUser(session.user.id);
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
    const newPrice = await StripeService.createPrice(stripeProductId, tier.price);

    await prisma?.tier.update({
      where: { id: tier.id },
      data: { stripePriceId: newPrice.id },
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

    const tier = await prisma.tier.create({
      data: tierAttributes as Tier,
    });

    if(!user.stripeProductId) {
      ProductService.createProduct(user.id);
    }
    
    if(await StripeService.userCanSell(user)) {
      await TierService.createStripePrice(tier);
    }

    return tier;
  }

  static async updateTier(id: string, tierData: Partial<Tier>) {
    // Ensure the current user is the owner of the tier or has permissions to update it
    const userId = await UserService.getCurrentUserId();

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
      await TierService.createStripePrice(tier);
    }

    // Start a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Fetch the current tier data
      const currentTier = await prisma.tier.findUnique({
        where: { id },
        include: { versions: true },
      });

      if (!currentTier) {
        throw new Error(`Tier with ID ${id} not found`);
      }

      // FIXME: this can clobber values if we're not careful
      const tierAttributes = tierData as any;
      tierAttributes.price = parseFloat(`${tierAttributes.price}`);
      tierAttributes.revision = currentTier.revision + 1;
      delete tierAttributes.id;
      delete tierAttributes.features;
      delete tierAttributes.stripePriceId;

      const writtenTier = await prisma.tier.update({
        where: { id },
        data: {
          ...(tierAttributes as Tier),
        },
      });

      if(TierService.shouldCreateNewVersion(currentTier, tierData)) {
        // Create a new TierVersion record with the pre-update price and stripePriceId
        await prisma.tierVersion.create({
          data: {
            tierId: id,
            price: currentTier.price,
            stripePriceId: currentTier.stripePriceId,
            revision: currentTier.revision,
          },
        });

        // remove the stripePriceId from the original tier
        await prisma.tier.update({
          where: { id },
          data: {
            stripePriceId: null,
          },
        });

        // Call the static class method onNewVersion
        await TierService.onNewVersion(writtenTier);
      }

      // Update the tier with the new data
      return writtenTier;
    });

    return result;
  }

  static shouldCreateNewVersion = (tier: Tier, tierData: Partial<Tier>) => {
    return (
      tierData.price &&
      tierData.price !== tier.price &&
      tierData.published === true
    );
  }

  static async onNewVersion(tier: Tier) {
    TierService.createStripePrice(tier);
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
          createdAt: "desc",
        },
      ],
    }); 
  }

  // this pulls all tiers for the admin to manage
  static async getTiersForAdmin() {
    const session = await getSession();
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }
    return prisma.tier.findMany({
      where: {
        userId: session.user.id
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
    const session = await getSession();
    if (!session?.user.id) {
      throw new Error("User not authenticated");
    }
  
    // Retrieve all customers subscribed to the tiers owned by the logged-in user
    const customers = await prisma.user.findMany({
      where: {
        subscriptions: {
          some: {
            tier: {
              userId: session.user.id,
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
              userId: session.user.id,
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
    const session = await getSession();
    if (!session?.user.id) {
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
                  userId: session.user.id,
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
              userId: session.user.id,
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

  static async getTiersForMatrix(tierId?: string, newTier?: Tier): Promise<TierWithFeatures[]> {
    const currentUser = await UserService.findCurrentUser();

    if (!currentUser) {
      throw new Error("Not logged in");
    }

    let allTiers: TierWithFeatures[] = await TierService.findByUserIdWithFeatures(currentUser.id);

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

  await TierService.createStripePrice(tier);
}

export const destroyStripePriceById = async (id: string) => {
  const tier = await TierService.findTier(id);
  if(!tier) {
    throw new Error('Tier not found.');
  }

  await TierService.destroyStripePrice(tier);
}

export default TierService;
export const { findTier, updateTier, createTier, createStripePrice, destroyStripePrice, getCustomersOfUserTiers, getTiersForMatrix } = TierService;