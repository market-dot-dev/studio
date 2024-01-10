import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// export async function getTier( id: string) {

//     const session = await getSession();
//     if (!session?.user.id) {
//       return {
//         error: "Not authenticated",
//       };
//     }

//     return await unstable_cache(
//       async () => {
//         return prisma.tier.findUnique({
//           where: {
//             id,
//             userId: session.user.id,
//           },
//           select: {
//             id: true,
//             name: true,
//             tagline: true,
//             published: true,
//             description: true,
//             createdAt: true,
//             versions: {
//               orderBy: {
//                 createdAt: 'desc' // Order by creation date in descending order
//               },
//               take: 1, // Take only the latest version
//               include: {
//                 features: true, // Include the features of the latest version
//               },
//             }
//           },
//         });
//       },
//       [`${session.user.id}-tier-${id}`],
//       {
//         revalidate: 900,
//         tags: [`${session.user.id}-tier-${id}`],
//       },
//     )();
    
// }

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