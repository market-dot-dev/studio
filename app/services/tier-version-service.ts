"use server";

import prisma from "@/lib/prisma";
import { Tier, TierVersion } from "@prisma/client";
import StripeService, { SubscriptionCadence } from "./StripeService";
import SubscriptionService from "./SubscriptionService";

// Define the version context type
export interface VersionContext {
  hasSubscribers: boolean;
  priceChanged: boolean;
  annualPriceChanged: boolean;
  materialChange: boolean;
  createNewVersion: boolean;
}

/**
 * Get all versions for a specific tier
 *
 * @param tierId - The ID of the tier to get versions for
 * @returns All tier versions, ordered by creation date (newest first)
 */
export async function getVersionsByTierId(tierId: string): Promise<TierVersion[]> {
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

/**
 * Determines if a tier update requires creating a new version
 *
 * @param tier - The current tier
 * @param attrs - The updated tier attributes
 * @returns Context object with version change information
 */
export async function buildVersionContext(
  tier: Tier,
  attrs: Partial<Tier>
): Promise<VersionContext> {
  const hasSubscribers = await SubscriptionService.hasSubscribers(tier.id, tier.revision);
  const cadenceChanged = attrs.cadence !== tier.cadence;
  const priceChanged = attrs.price !== tier.price || cadenceChanged;
  const annualPriceChanged = attrs.priceAnnual !== tier.priceAnnual;

  return {
    hasSubscribers,
    priceChanged,
    annualPriceChanged,
    materialChange: priceChanged || annualPriceChanged,
    createNewVersion:
      hasSubscribers && (attrs.published ?? false) && (priceChanged || annualPriceChanged)
  };
}

/**
 * Creates a new tier version when pricing information is changed
 *
 * @param tierId - The ID of the tier
 * @param tier - The current tier
 * @param attrs - The new tier attributes
 * @returns The created tier version
 */
export async function createTierVersion(
  tierId: string,
  tier: Tier,
  attrs: Partial<Tier>
): Promise<TierVersion> {
  // Create a snapshot of the current version
  const newVersion = await prisma.tierVersion.create({
    data: {
      tierId,
      price: tier.price,
      stripePriceId: tier.stripePriceId,
      cadence: tier.cadence,
      priceAnnual: tier.priceAnnual,
      stripePriceIdAnnual: tier.stripePriceIdAnnual,
      revision: tier.revision
    }
  });

  // Increment the revision in the attributes
  attrs.revision = tier.revision + 1;
  attrs.cadence = (attrs.cadence || "month") as SubscriptionCadence;

  return newVersion;
}

/**
 * Builds tier attributes for versioning
 *
 * @param tier - The current tier
 * @param attrs - The updated tier attributes
 * @param context - The version context
 * @returns Tier attributes for the update
 */
export function buildTierVersionAttributes(
  tier: Tier,
  attrs: Partial<Tier>,
  context: {
    priceChanged: boolean;
    annualPriceChanged: boolean;
  }
): Partial<Tier> {
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

/**
 * Handles the versioning process in tier updates
 *
 * @param tierId - The ID of the tier
 * @param tier - The current tier
 * @param attrs - The updated tier attributes
 * @param context - The version context with pricing change information
 */
export async function handleVersioning(
  tierId: string,
  tier: Tier,
  attrs: Partial<Tier>,
  context: {
    priceChanged: boolean;
    annualPriceChanged: boolean;
  }
): Promise<void> {
  await createTierVersion(tierId, tier, attrs);

  const tierAttributes = buildTierVersionAttributes(tier, attrs, context);
  await prisma.tier.update({
    where: { id: tierId },
    data: tierAttributes
  });
}

/**
 * Handles price updates for a tier that doesn't need versioning
 *
 * @param tier - The current tier
 * @param attrs - The updated tier attributes
 * @param stripeAccountId - The Stripe account ID
 * @param context - The version context with pricing change information
 */
export async function handlePriceUpdates(
  tier: Tier,
  attrs: Partial<Tier>,
  stripeAccountId: string,
  context: {
    priceChanged: boolean;
    annualPriceChanged: boolean;
  }
): Promise<void> {
  const stripeService = new StripeService(stripeAccountId);

  if (context.priceChanged && tier.stripePriceId) {
    attrs.stripePriceId = null;
    await stripeService.destroyPrice(tier.stripePriceId);
  }

  if (context.annualPriceChanged && tier.stripePriceIdAnnual) {
    attrs.stripePriceIdAnnual = null;
    await stripeService.destroyPrice(tier.stripePriceIdAnnual);
  }
}

/**
 * Check if a tier needs version management when updating pricing
 *
 * @param tier - The current tier
 * @param updatedTier - The updated tier attributes
 * @returns True if a new version should be created
 */
export async function shouldCreateNewVersion(
  tier: Tier,
  updatedTier: Partial<Tier>
): Promise<boolean> {
  // If no subscribers, no need for versioning
  const hasSubscribers = await SubscriptionService.hasSubscribers(tier.id, tier.revision);
  if (!hasSubscribers || !updatedTier.published) {
    return false;
  }

  // Check if pricing attributes changed
  const priceChanged = updatedTier.price !== tier.price || updatedTier.cadence !== tier.cadence;
  const annualPriceChanged = updatedTier.priceAnnual !== tier.priceAnnual;

  return priceChanged || annualPriceChanged;
}

/**
 * Get the current active version of a tier
 *
 * @param tierId - The ID of the tier
 * @returns The current tier version
 */
export async function getCurrentTierVersion(tierId: string): Promise<TierVersion | null> {
  const tier = await prisma.tier.findUnique({
    where: { id: tierId },
    select: { revision: true }
  });

  if (!tier) return null;

  return prisma.tierVersion.findFirst({
    where: {
      tierId,
      revision: tier.revision
    }
  });
}

/**
 * Get version history statistics for a tier
 *
 * @param tierId - The ID of the tier
 * @returns Stats about each version including subscriber count
 */
export async function getTierVersionStats(tierId: string): Promise<any[]> {
  const versions = await getVersionsByTierId(tierId);

  const stats = await Promise.all(
    versions.map(async (version) => {
      const subscriberCount = await SubscriptionService.subscriberCount(tierId, version.revision);
      return {
        ...version,
        subscriberCount
      };
    })
  );

  return stats;
}
