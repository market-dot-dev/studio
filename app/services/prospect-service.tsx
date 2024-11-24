"use server";

import prisma from "@/lib/prisma";
import { Prospect } from "@prisma/client";
import Tier from "../models/Tier";

class ProspectService {
  static async addNewProspectForPackage(
    prospect: { email: string; name: string },
    tier: Tier,
  ): Promise<Prospect> {
    return prisma.prospect.upsert({
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
  }
}

export const { addNewProspectForPackage } = ProspectService;
export default ProspectService;
