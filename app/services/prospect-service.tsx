"use server";

import prisma from "@/lib/prisma";
import { Prospect } from "@prisma/client";
import Tier from "../models/Tier";
import UserService from "./UserService";
import { notifyOwnerOfNewProspect } from "./email-service";

class ProspectService {
  static async getProspects(userId: string): Promise<(Prospect & { tier: Tier })[]> {
    if (!userId) {
      console.warn("getProspects called without valid userId");
      return [];
    }

    const response = await prisma.prospect.findMany({
      where: { userId },
      include: { tiers: true },
      orderBy: { createdAt: "desc" }
    });

    return response.map((prospect) => ({
      ...prospect,
      tier: prospect.tiers[0]
    }));
  }

  static async addNewProspectForPackage(
    prospect: {
      email: string;
      name: string;
      organization: string;
      context: string;
    },
    tier: Tier
  ): Promise<Prospect> {
    const user = await UserService.findUser(tier.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const newProspect = await prisma.prospect.upsert({
      where: {
        email_userId: {
          email: prospect.email,
          userId: tier.userId
        }
      },
      create: {
        ...prospect,
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
}

export const { addNewProspectForPackage } = ProspectService;
export default ProspectService;
