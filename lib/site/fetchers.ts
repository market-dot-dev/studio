import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

// gets site from admin session
export async function getSite() {
  const session = await getSession();

  if (!session?.user.id) {
    throw new Error("Not authenticated");
  }

  return await unstable_cache(
    async () => {
      return prisma.site.findFirst({
        where: {
          userId: session.user.id
        },
        select: {
          id: true,
          userId: true,
          subdomain: true,
          homepageId: true
        }
      });
    },
    [`admin-${session.user.id}-site`],
    {
      revalidate: 900,
      tags: [`admin-${session.user.id}-site`]
    }
  )();
}
