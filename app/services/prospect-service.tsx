"use server";

import prisma from "@/lib/prisma";
import { Prospect } from "../generated/prisma";
import Tier from "../models/Tier";
import UserService from "./UserService";
import { notifyOwnerOfNewProspect } from "./email-service";

class ProspectService {
  static async getProspects(userId: string): Promise<(Prospect & { tier: Tier })[]> {
    if (!userId) {
      console.warn("getProspects called without valid userId");
      return [];
    }

    const prospects = await prisma.prospect.findMany({
      where: { userId },
      include: { tiers: true },
      orderBy: { createdAt: "desc" }
    });

    return prospects.map((prospect) => ({
      ...prospect,
      tier: prospect.tiers[0]
    }));
  }

  static async addNewProspectForPackage(
    prospect: {
      email: Prospect["email"];
      name: Prospect["name"];
      companyName: Prospect["companyName"];
      context: Prospect["context"];
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

    await notifyOwnerOfNewProspect(
      user,
      { email: newProspect.email, name: newProspect.name },
      tier.name
    );
    return newProspect;
  }
}

export const { addNewProspectForPackage } = ProspectService;
export default ProspectService;
