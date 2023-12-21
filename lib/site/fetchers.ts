import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function getSiteNav(siteId: string) {
    return await unstable_cache(
        async () => {
            return prisma.page.findMany({
                where: {
                    siteId,
                    draft: false
                },
                select: {
                    id: true,
                    title: true,
                    slug: true
                }
            });
        },
        [`${siteId}-nav`],
        {
        revalidate: 900,
        tags: [`${siteId}-nav`],
        },
    )();
}