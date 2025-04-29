"use server";

import { getSession } from "@/lib/auth";
import { newPageTemplate } from "@/lib/constants/site-template";
import prisma from "@/lib/prisma";
import { Page } from "@prisma/client";
import SessionService from "./session-service";
import { getCurrentSite } from "./site-crud-service";

class PageService {
  static getSubdomain(domain: string) {
    return domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
      ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
      : null;
  }

  /**
   * Get a specific page by subdomain and slug
   * Used for frontend site rendering
   */
  static async getPage(subdomain: string, slug: string) {
    const site = await prisma.site.findUnique({
      where: {
        subdomain
      },
      select: {
        id: true,
        userId: true,
        user: {
          select: {
            name: true,
            image: true,
            projectName: true,
            projectDescription: true
          }
        },
        pages: {
          where: {
            slug: slug,
            draft: false
          },
          take: 1,
          select: {
            content: true,
            title: true,
            slug: true,
            id: true
          }
        }
      }
    });

    return site;
  }

  /**
   * Get the homepage for a site by subdomain
   * Used for frontend site rendering
   */
  static async getHomepage(subdomain: string) {
    const site = await prisma.site.findUnique({
      where: {
        subdomain
      },
      select: {
        id: true,
        userId: true,
        user: {
          select: {
            name: true,
            image: true,
            projectName: true,
            projectDescription: true
          }
        },
        homepageId: true
      }
    });

    if (!site?.homepageId) {
      return null;
    }

    const page = await prisma.page.findUnique({
      where: {
        id: site.homepageId,
        draft: false
      },
      select: {
        content: true,
        title: true,
        slug: true,
        id: true
      }
    });

    return { ...site, homepage: page };
  }

  static async findPage(subdomain: string, slug: string) {
    const currentUserId = await SessionService.getCurrentUserId();

    const site = await prisma.site.findUnique({
      where: {
        subdomain
      },
      include: {
        user: true,
        pages: {
          where: {
            slug: slug,
            OR: [
              {
                site: {
                  userId: currentUserId
                }
              },
              { draft: false }
            ]
          },
          take: 1
        }
      }
    });

    return site;
  }

  static async setHomepage(siteId: string, id: string) {
    const userId = await SessionService.getCurrentUserId();
    return await prisma.site.update({
      where: {
        id: siteId,
        userId
      },
      data: {
        homepageId: id
      }
    });
  }

  static async deletePage(id: string) {
    const userId = await SessionService.getCurrentUserId();

    // First, retrieve the page along with the related site's homepageId
    const page = await prisma.page.findUnique({
      where: {
        id,
        site: {
          userId
        }
      },
      include: {
        site: {
          select: { homepageId: true, userId: true } // Only fetch the homepageId from the related site
        }
      }
    });

    if (!page) {
      throw new Error("Page not found.");
    }

    if (page.site.userId !== userId) {
      throw new Error("You don't own that page.");
    }

    if (page.site.homepageId === id) {
      throw new Error("Cannot delete the homepage of a site.");
    }

    // If the checks pass, proceed to delete the page
    return await prisma.page.delete({
      where: { id }
    });
  }

  static async updatePage(id: string, pageAttributes: Partial<Page>) {
    const session = await getSession();

    if (!session?.user.id) {
      return {
        error: "Not authenticated"
      };
    }
    const page = await prisma.page.findUnique({
      where: {
        id
      },
      include: {
        site: true
      }
    });
    if (!page || page.userId !== session.user.id) {
      return {
        error: "Page not found"
      };
    }
    try {
      const response = await prisma.page.update({
        where: {
          id: id
        },
        data: {
          title: pageAttributes.title,
          slug: pageAttributes.slug,
          content: pageAttributes.content,
          draft: pageAttributes.draft
        }
      });

      return response;
    } catch (error: any) {
      return {
        error: error.message
      };
    }
  }

  static async createPage() {
    const session = await getSession();
    if (!session?.user.id) {
      throw new Error("Not authenticated");
    }

    // First, retrieve the site
    const site = await getCurrentSite();

    if (!site) {
      throw new Error("Site not found.");
    }

    const response = await prisma.page.create({
      data: {
        siteId: site.id,
        userId: session.user.id,
        content: newPageTemplate ?? ""
      }
    });

    // await revalidateTag(
    //   `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`,
    // );
    // site.customDomain && (await revalidateTag(`${site.customDomain}-posts`));

    return response;
  }
}

export const { findPage, updatePage, setHomepage, deletePage, createPage } = PageService;

export default PageService;
