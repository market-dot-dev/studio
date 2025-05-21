"use server";

import prisma from "@/lib/prisma";
import { Prospect } from "../generated/prisma";
import Tier from "../models/Tier";
import { findUser } from "./UserService";
import { notifyOwnerOfNewProspect } from "./email-service";

/**
 * Get all prospects for an Organization
 */
export async function getProspects(orgId: string): Promise<(Prospect & { tier: Tier })[]> {
  if (!orgId) {
    console.warn("getProspects called without valid orgId");
    return [];
  }

  const prospects = await prisma.prospect.findMany({
    where: { organizationId: orgId },
    include: { tiers: true },
    orderBy: { createdAt: "desc" }
  });

  return prospects.map((prospect) => ({
    ...prospect,
    tier: prospect.tiers[0]
  }));
}

/**
 * Add a new prospect for a package/tier
 */
export async function addNewProspectForPackage(
  prospect: {
    email: Prospect["email"];
    name: Prospect["name"];
    companyName: Prospect["companyName"];
    context: Prospect["context"];
  },
  tier: Tier
): Promise<Prospect> {
  // @TODO: This should notify the organization owner
  const user = await findUser(tier.userId);
  if (!user) {
    throw new Error("User not found");
  }

  const newProspect = await prisma.prospect.upsert({
    where: {
      email_organizationId: {
        email: prospect.email,
        organizationId: tier.organizationId
      }
    },
    create: {
      ...prospect,
      organizationId: tier.organizationId,
      tiers: { connect: [{ id: tier.id }] }
    },
    update: {
      ...prospect,
      organizationId: tier.organizationId,
      tiers: { connect: [{ id: tier.id }] }
    }
  });

  await notifyOwnerOfNewProspect(
    user,
    { email: newProspect.email, name: newProspect.name },
    tier.name
  );

  return newProspect;
}
