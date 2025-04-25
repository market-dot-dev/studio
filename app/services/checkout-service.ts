"use server";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Contract, Tier, User } from "@prisma/client";

export interface CheckoutData {
  tier: Tier | null;
  contract: Contract | null;
  vendor: User | null;
  currentUser: User | null;
  isAnnual: boolean;
}

export async function getCheckoutData(
  tierId: string,
  isAnnual: boolean = false
): Promise<CheckoutData> {
  // Get current user from session
  const session = await getSession();
  const currentUser = session?.user?.id
    ? await prisma.user.findUnique({ where: { id: session.user.id } })
    : null;

  // Fetch tier data
  const tier = await prisma.tier.findUnique({
    where: { id: tierId }
  });

  if (!tier) {
    return {
      tier: null,
      contract: null,
      vendor: null,
      currentUser,
      isAnnual
    };
  }

  // Fetch vendor and contract in parallel
  const [vendor, contract] = await Promise.all([
    tier.userId ? prisma.user.findUnique({ where: { id: tier.userId } }) : null,
    tier.contractId ? prisma.contract.findUnique({ where: { id: tier.contractId } }) : null
  ]);

  return {
    tier,
    contract,
    vendor,
    currentUser,
    isAnnual
  };
}

export async function getShortenedCadence(cadence: string | undefined) {
  if (cadence === "month") return "mo";
  if (cadence === "year") return "yr";
  return cadence;
}
