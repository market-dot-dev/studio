"use server";

import prisma from "@/lib/prisma";

class SiteService {
  static async getSiteNav(siteId: any = null, userId: any = null) {
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
}

export default SiteService;
export const { getSiteNav } = SiteService;
