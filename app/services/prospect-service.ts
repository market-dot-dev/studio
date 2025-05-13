"use server";

import prisma from "@/lib/prisma";
import { Lead, LeadSource, Tier } from "@prisma/client";
import { notifyOwnerOfNewProspect } from "./email-service";
import UserService from "./UserService";

export type ProspectWithTier = Lead & { tier: Tier };
export type ProspectWithTiers = Lead & { tiers: Tier[] };

// Get prospects
export async function getProspectsWithTier(userId: string): Promise<ProspectWithTier[]> {
  if (!userId) {
    console.warn("getProspects called without valid userId");
    return [];
  }

  const prospects = await prisma.lead.findMany({
    where: {
      userId,
      source: LeadSource.CONTACT_FORM
    },
    include: { tiers: true },
    orderBy: { createdAt: "desc" }
  });

  return prospects.map((prospect) => ({
    ...prospect,
    tier: prospect.tiers[0]
  }));
}

// Add a new prospect from contact form
export async function addNewProspectForTier(
  prospect: {
    email: string;
    name: string;
    organization: string;
    context: string;
  },
  tier: Tier
): Promise<Lead> {
  const user = await UserService.findUser(tier.userId);
  if (!user) {
    throw new Error("User not found");
  }

  const newProspect = await prisma.lead.upsert({
    where: {
      email_userId: {
        email: prospect.email,
        userId: tier.userId
      }
    },
    create: {
      ...prospect,
      source: LeadSource.CONTACT_FORM,
      userId: tier.userId,
      tiers: { connect: [{ id: tier.id }] }
    },
    update: {
      ...prospect,
      userId: tier.userId,
      tiers: { connect: [{ id: tier.id }] }
    }
  });

  await notifyOwnerOfNewProspect(user, newProspect, tier.name);
  return newProspect;
}
