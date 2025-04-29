"use server";

import prisma from "@/lib/prisma";

/**
 * Retrieves site navigation items (pages) for a site
 * @param siteId - Optional site ID to get navigation for
 * @param userId - Optional user ID to get navigation for
 * @returns Array of navigation items or error
 */
export async function getSiteNav(siteId?: string | null, userId?: string) {
  if (!siteId && !userId) {
    return {
      error: "No siteId or userId provided"
    };
  }

  return prisma.page.findMany({
    where: {
      ...(siteId ? { siteId } : { userId }),
      draft: false
    },
    select: {
      id: true,
      title: true,
      slug: true
    }
  });
}
