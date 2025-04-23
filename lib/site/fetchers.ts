import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { includeSiteMeta, type SiteMeta } from "./types";

// gets site from admin session
export async function getSiteMeta(): Promise<SiteMeta | null> {
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
        ...includeSiteMeta
      });
    },
    [`admin-${session.user.id}-site`],
    {
      revalidate: 900,
      tags: [`admin-${session.user.id}-site`]
    }
  )();
}
