"use server";

import prisma from "@/lib/prisma";
import { Page } from "@prisma/client";
import { getSession } from "@/lib/auth";

class PageService {
  static async getCurrentUserId() {
    const session = await getSession();
    return session?.user.id;
  }

  static getSubdomain(domain: string) {
    return domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;
  }

  // meant for frontend site rendering
  static async getPage(subdomain: string, slug: string) {
    const site = await prisma.site.findUnique({
      where: { 
        subdomain,
      },
      select: {
        id: true,
        userId: true,
        user: {
          select: {
            name: true,
            image: true,
            projectName: true,
            projectDescription: true,
          }
        },
        pages: {
          where: {
            slug: slug,
            draft: false
          },
          take: 1,
          select: {
            content: true
          }
        }
      }
    });
  
    return site;
  }

  // meant for frontend site rendering
  static async getHomepage(subdomain: string) {
    const site = await prisma.site.findUnique({
      where: {
        subdomain,
      },
      select: {
        id: true,
        userId: true, 
        user: {
          select: {
            name: true,
            image: true,
            projectName: true,
            projectDescription: true,
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
        content: true
      }
    });
  
    return {...site, homepage: page};
  }
  
  static async findPage(subdomain: string, slug: string) {

    const currentUserId = await PageService.getCurrentUserId();
  
    const site = await prisma.site.findUnique({
      where: { 
        subdomain,
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
            ],
          },
          take: 1
        }
      }
    });
  
    return site;
  };

  static async setHomepage(siteId: string, id: string) {
    return await prisma.site.update({
      where: {
        id: siteId,
        userId: await this.getCurrentUserId(),
      },
      data: {
        homepageId: id
      }
    })
  };

  static async deletePage(id: string) {
    // First, retrieve the page along with the related site's homepageId
    const page = await prisma.page.findUnique({
      where: {
        id,
        site: {
          userId: await this.getCurrentUserId()
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

    if (page.site.userId !== await this.getCurrentUserId()) {
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
        error: "Not authenticated",
      };
    }
    const page = await prisma.page.findUnique({
      where: {
        id,
      },
      include: {
        site: true,
      },
    });
    if (!page || page.userId !== session.user.id) {
      return {
        error: "Page not found",
      };
    }
    try {
      const response = await prisma.page.update({
        where: {
          id: id,
        },
        data: {
          title: pageAttributes.title,
          slug: pageAttributes.slug,
          content: pageAttributes.content,
          draft: pageAttributes.draft,
        },
      });

      return response;
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  }
};

export const { findPage, updatePage, setHomepage, deletePage } = PageService

export default PageService;