import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

// gets the pages of the site for either the site Id or the user Id
export async function getSiteNav(siteId: any = null, userId: any = null) {
    
    if (!siteId && !userId) {
        return {
            error: "No siteId or userId provided",
        };
    }

    return await unstable_cache(
        async () => {
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
        },
        [`${siteId ?? userId}-nav`],
        {
        revalidate: 900,
        tags: [`${siteId ?? userId}-nav`],
        },
    )();
}