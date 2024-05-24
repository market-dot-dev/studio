"use server";

import prisma from "@/lib/prisma";
import SessionService from "./SessionService";

class ReportingService {
    static async getSubscriptionsCreated() {
        
      const userId = await SessionService.getCurrentUserId();
        
        return await prisma.subscription.findMany({
            where: {
              createdAt: {
                gte: new Date(new Date().getFullYear(), 0, 1), // Start of the current year
                lte: new Date(new Date().getFullYear(), 11, 31) // End of the current year
              },
              // tier: {
              //   userId: userId, // owner of the tier
              // },
            },
            select: {
                createdAt: true,
                tier: {
                  select: {
                    price: true 
                  }
                }
            }
        });
    }
}

export default ReportingService;
export const { getSubscriptionsCreated } = ReportingService;