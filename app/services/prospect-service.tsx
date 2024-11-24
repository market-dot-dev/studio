"use server";

import prisma from "@/lib/prisma";
import { Prospect } from "@prisma/client";
import Tier from "../models/Tier";
import EmailService from "./EmailService";
import UserService from "./UserService";

class ProspectService {
  static async addNewProspectForPackage(
    prospect: { email: string; name: string },
    tier: Tier,
  ): Promise<Prospect> {
    const user = await UserService.findUser(tier.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const newProspect = await prisma.prospect.upsert({
      where: {
        email_userId: {
          email: prospect.email,
          userId: tier.userId,
        },
      },
      create: {
        ...prospect,
        userId: tier.userId,
        tiers: { connect: [{ id: tier.id }] },
      },
      update: {
        ...prospect,
        userId: tier.userId,
        tiers: { connect: [{ id: tier.id }] },
      },
    });

    await EmailService.sendNewProspectEmail(user, newProspect, tier.name);
    return newProspect;
  }
}

export const { addNewProspectForPackage } = ProspectService;
export default ProspectService;
