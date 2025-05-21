"use server";

import { Channel } from "@/app/generated/prisma";
import Tier, { newTier } from "@/app/models/Tier";
import defaultTiers from "@/lib/constants/tiers/default-tiers";
import prisma from "@/lib/prisma";
import { updateServicesForSale } from "../market-service";
import { createStripePrice, type SubscriptionCadence } from "../stripe/stripe-price-service";
import { createStripeProduct, updateStripeProduct } from "../stripe/stripe-product-service";
import { requireUser, requireUserSession } from "../user-context-service";
import { buildVersionContext, handlePriceUpdates, handleVersioning } from "./tier-version-service";

export type TierWithCount = Tier & {
  _count?: { Charge: number; subscriptions: number };
};
export type CheckoutType = "gitwallet" | "contact-form";

/**
 * Find tier by ID with associated counts
 */
export async function getTierById(id: string): Promise<Tier | null> {
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

/**
 * Create a tier from a template
 */
export async function createTemplateTier(index?: number) {
  const tierIndex = index || 0;
  const defaultTier = defaultTiers[tierIndex]["data"];

  try {
    const tier = {
      ...defaultTier,
      published: false,
      revision: 0,
      contractId: "standard-msa"
    };

    const createdTier = await createTier(tier);

    return {
      success: true,
      id: createdTier.id
    };
  } catch (error) {
    console.error("Error creating template tier", error);
    throw error;
  }
}

/**
 * Helper function to convert tier data to a row for update/create operations
 * @private Only used internally, not exported
 */
async function toTierRow(tier: TierWithCount | Tier | Partial<Tier>) {
  const result = { ...tier } as any;
  delete result.id;
  delete result.versions;
  delete result._count;
  delete result.userId;
  delete result.createdAt;
  delete result.updatedAt;
  return result as Tier;
}

/**
 * Create a new tier
 */
export async function createTier(tierData: Partial<Tier>) {
  // Ensure the current user is the owner of the tier or has permissions to create it
  const user = await requireUser();

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
    userId: user.id
  }) as Partial<Tier>;

  if (user.stripeAccountId) {
    const product = await createStripeProduct(
      user.stripeAccountId,
      tierData.name,
      attrs.description || undefined
    );
    const price = await createStripePrice(
      user.stripeAccountId,
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

/**
 * Delete a tier by ID
 */
export async function deleteTier(id: string) {
  const user = await requireUser();
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

/**
 * Update an existing tier
 */
export async function updateTier(id: string, tierData: Partial<Tier>) {
  const user = await requireUser();
  const tier = await findAndValidateTier(id, user.id);
  const attrs = prepareAttributes(tier, tierData);

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
      // Use the extracted version service for handling price updates & stripe product
      if (context.stripeConnected && user.stripeAccountId && tier.stripeProductId) {
        if (attrs.name && attrs.description) {
          await updateStripeProduct(
            user.stripeAccountId,
            tier.stripeProductId,
            attrs.name,
            attrs.description
          );
        }
        await handlePriceUpdates(tier, attrs, user.stripeAccountId, context);
      }
    }

    if (context.stripeConnected && attrs.published) {
      await handleStripeProducts(attrs, user.stripeAccountId!);
    }
  }

  const row = await toTierRow(attrs);
  const updatedTier = await prisma.tier.update({
    where: { id },
    data: row
  });

  if (user.marketExpertId) {
    await updateServicesForSale();
  }
  return updatedTier;
}

/**
 * Helper function to find and validate a tier
 * @private
 */
async function findAndValidateTier(id: string, userId: string) {
  const tier = await prisma.tier.findUnique({
    where: { id, userId },
    include: { versions: true }
  });
  if (!tier) throw new Error(`Tier with ID ${id} not found`);
  return tier;
}

/**
 * Helper function to prepare tier attributes for update
 * @private
 */
function prepareAttributes(tier: Tier, tierData: Partial<Tier>) {
  const attrs: Partial<Tier> = newTier({ ...tier, ...tierData });
  if (!attrs.name) throw new Error("Tier name is required.");
  if (tierData.checkoutType === "gitwallet" && !attrs.price) throw new Error("Price is required.");
  return attrs;
}

/**
 * Helper function to handle Stripe product and price creation/update
 * @private
 */
async function handleStripeProducts(attrs: Partial<Tier>, stripeAccountId: string) {
  if (!attrs.stripeProductId) {
    const product = await createStripeProduct(
      stripeAccountId,
      attrs.name!,
      attrs.description || attrs.tagline || undefined
    );
    attrs.stripeProductId = product.id;
    if (!attrs.stripeProductId) throw new Error("Failed to create stripe product id.");
  }

  if (!attrs.stripePriceId) {
    const price = await createStripePrice(
      stripeAccountId,
      attrs.stripeProductId,
      attrs.price!,
      attrs.cadence as SubscriptionCadence
    );
    attrs.stripePriceId = price.id;
  }

  if (!attrs.stripePriceIdAnnual && attrs.priceAnnual) {
    const priceAnnual = await createStripePrice(
      stripeAccountId,
      attrs.stripeProductId,
      attrs.priceAnnual,
      "year"
    );
    attrs.stripePriceIdAnnual = priceAnnual.id;
  }
}

/**
 * Find all tiers belonging to a specific user
 */
export async function findByUserId(userId: string) {
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

/**
 * Find all tiers belonging to a specific user with counts
 */
export async function listTiersByUserIdWithCounts(userId: string): Promise<TierWithCount[]> {
  return prisma.tier.findMany({
    where: { userId },
    orderBy: [
      {
        published: "desc"
      }
    ]
  });
}

/**
 * Get published tiers for a specific organization
 * Used to display tiers on the front end site for customers to subscribe to
 */
export async function getPublishedTiersForOrganization(
  orgId: string,
  tierIds: string[] = [],
  channel?: Channel
) {
  // @TODO: Returned data here does not match the expected type in "TierCard", should match
  return prisma.tier.findMany({
    where: {
      organizationId: orgId,
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

/**
 * Get published tiers for the current user
 */
export async function getPublishedTiers(tierIds: string[] = [], channel?: Channel) {
  const user = await requireUserSession();
  return getPublishedTiersForOrganization(user.id, tierIds, channel);
}

/**
 * Create a duplicate of an existing tier
 */
export async function duplicateTier(tierId: string) {
  const user = await requireUserSession();

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
    const createdTier = await createTier(newTierData);
    return createdTier;
  } catch (error) {
    console.error("Error duplicating tier:", error);
    throw error;
  }
}
