import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

// @TODO: This file may be deprecated
// get subscriptions of the logged in customer from a specific user/site
export async function getSubscriptions(sellerId: string) {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated"
    };
  }

  return await unstable_cache(
    async () => {
      return prisma.subscription.findMany({
        where: {
          userId: session?.user.id,
          tierVersion: {
            tier: {
              userId: sellerId
            }
          }
        },
        select: {
          id: true,
          tierVersion: {
            select: {
              id: true,
              tier: {
                select: {
                  id: true,
                  name: true,
                  tagline: true,
                  description: true
                }
              }
            }
          }
        },
        orderBy: [
          {
            createdAt: "desc"
          }
        ]
      });
    },
    [`$subs-${session.user.id}-tiers`],
    {
      revalidate: 900,
      tags: [`subs-${session.user.id}-tiers`]
    }
  )();
}
