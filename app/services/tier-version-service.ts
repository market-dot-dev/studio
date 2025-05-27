"use server";

import { Tier, TierVersion } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { deactivateStripePrice, type SubscriptionCadence } from "./stripe-price-service";
import { checkTierHasSubscribers } from "./subscription-service";

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
  const hasSubs = await checkTierHasSubscribers(tier.id, tier.revision);
  const cadenceChanged = attrs.cadence !== tier.cadence;
  const priceChanged = attrs.price !== tier.price || cadenceChanged;
  const annualPriceChanged = attrs.priceAnnual !== tier.priceAnnual;

  return {
    hasSubscribers: hasSubs,
    priceChanged,
    annualPriceChanged,
    materialChange: priceChanged || annualPriceChanged,
    createNewVersion: hasSubs && (attrs.published ?? false) && (priceChanged || annualPriceChanged)
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
export async function buildTierVersionAttributes(
  tier: Tier,
  attrs: Partial<Tier>,
  context: {
    priceChanged: boolean;
    annualPriceChanged: boolean;
  }
): Promise<Partial<Tier>> {
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

  const tierAttributes = await buildTierVersionAttributes(tier, attrs, context);
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
  if (context.priceChanged && tier.stripePriceId) {
    attrs.stripePriceId = null;
    await deactivateStripePrice(stripeAccountId, tier.stripePriceId);
  }

  if (context.annualPriceChanged && tier.stripePriceIdAnnual) {
    attrs.stripePriceIdAnnual = null;
    await deactivateStripePrice(stripeAccountId, tier.stripePriceIdAnnual);
  }
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
