import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// this pulls published tiers to display on the front end site for customers to subscribe to
export async function getTiersForUser( userId: string) {
  return await unstable_cache(
    async () => {
      return prisma.tier.findMany({
        where: {
          userId,
          published: true
        },
        select: {
          id: true,
          name: true,
          tagline: true,
          description: true,
          createdAt: true,
          versions: {
            orderBy: {
              createdAt: 'desc' // Order by creation date in descending order
            },
            take: 1, // Take only the latest version
            include: {
              features: true, // Include the features of the latest version
            },
          }
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
    },
    [`${userId}-tiers`],
    {
      revalidate: 900,
      tags: [`${userId}-tiers`],
    },
  )();
}

// this pulls all tiers for the admin to manage
export async function getTiersForAdmin() {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  return await unstable_cache(
    async () => {
      return prisma.tier.findMany({
        where: {
          userId: session.user.id
        },
        select: {
          id: true,
          name: true,
          tagline: true,
          description: true,
          createdAt: true,
          versions: {
            orderBy: {
              createdAt: 'desc' // Order by creation date in descending order
            },
            take: 1, // Take only the latest version
            include: {
              features: true, // Include the features of the latest version
            },
          }
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
    },
    [`admin-${session.user.id}-tiers`],
    {
      revalidate: 900,
      tags: [`admin-${session.user.id}-tiers`],
    },
  )();

 
}

export async function getTier( id: string) {

    const session = await getSession();
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }

    return await unstable_cache(
      async () => {
        return prisma.tier.findUnique({
          where: {
            id,
            userId: session.user.id,
          },
          select: {
            id: true,
            name: true,
            tagline: true,
            published: true,
            description: true,
            createdAt: true,
            versions: {
              orderBy: {
                createdAt: 'desc' // Order by creation date in descending order
              },
              take: 1, // Take only the latest version
              include: {
                features: true, // Include the features of the latest version
              },
            }
          },
        });
      },
      [`${session.user.id}-tier-${id}`],
      {
        revalidate: 900,
        tags: [`${session.user.id}-tier-${id}`],
      },
    )();
    
}
// get subscriptions of the logged in customer from a specific user/site
export async function getSubscriptions( sellerId: string) {
  
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
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
                  description: true,
                }
              }
            }
          }
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
    },
    [`$subs-${session.user.id}-tiers`],
    {
      revalidate: 900,
      tags: [`subs-${session.user.id}-tiers`],
    },
  )();
}