"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import Tier, { newTier } from "@/app/models/Tier";
import StripeService from "./StripeService";
import UserService from "./UserService";
import { unstable_cache } from "next/cache";

class TierService {
  static async createStripePrice(tier: Tier) {
    const session = await getSession();
    const currentUser = await UserService.findUser(session?.user.id || '');
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
    const userId = await UserService.getCurrentUserId();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const tierAttributes = newTier({
      ...tierData,
      userId,
    }) as any;

    tierAttributes.price = parseFloat(`${tierAttributes.price}`);
    tierAttributes.userId = userId || '1';

    const tier = await prisma.tier.create({
      data: tierAttributes as Tier,
    });

    return tier;
  }

  static async updateTier(id: string, tierData: Partial<Tier>) {
    // Ensure the current user is the owner of the tier or has permissions to update it
    const userId = await UserService.getCurrentUserId();
    if (!userId) {
      throw new Error("User not authenticated");
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

      const tierAttributes = tierData as any;
      tierAttributes.price = parseFloat(`${tierAttributes.price}`);
      tierAttributes.revision = currentTier.revision + 1;
      delete tierAttributes.id;
      delete tierAttributes.features;

      const writtenTier = await prisma.tier.update({
        where: { id },
        data: {
          ...(tierAttributes as Tier),
        },
      });

      // Check if the price has changed
      if (tierData.price && tierData.price !== currentTier.price) {
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

  static async onNewVersion(tier: Tier) {
    console.log(`New version ${tier.revision} created for tier ${tier.id}`);
    TierService.createStripePrice(tier);
  }

  // this pulls published tiers to display on the front end site for customers to subscribe to
  static async getTiersForUser( userId: string) {
    return await unstable_cache(
      async () => {
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
      },
      [`${userId}-tiers`],
      {
        revalidate: 900,
        tags: [`${userId}-tiers`],
      },
    )();
  }

  // this pulls all tiers for the admin to manage
  static async getTiersForAdmin() {
    const session = await getSession();
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }

    return await unstable_cache(
      async () => {
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
      },
      [`admin-${session.user.id}-tiers`],
      {
        revalidate: 900,
        tags: [`admin-${session.user.id}-tiers`],
      },
    )();

  
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
export const { findTier, updateTier, createTier, createStripePrice, destroyStripePrice } = TierService;