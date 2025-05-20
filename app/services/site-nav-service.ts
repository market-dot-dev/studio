"use server";

import prisma from "@/lib/prisma";

/**
 * Retrieves site navigation items (pages) for a site
 * @param siteId - Optional site ID to get navigation for
 * @param orgId - Optional organization ID to get navigation for
 * @returns Array of navigation items or error
 */
export async function getSiteNav(siteId?: string | null, orgId?: string) {
  if (!siteId && !orgId) {
    return {
      error: "No siteId or orgId provided"
    };
  }

  return prisma.page.findMany({
    where: {
      ...(siteId ? { siteId } : { organizationId: orgId }),
      draft: false
    },
    select: {
      id: true,
      title: true,
      slug: true
    }
  });
}
