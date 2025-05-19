"use server";

import { Page } from "@/app/generated/prisma";
import { newPageTemplate } from "@/lib/constants/site-template";
import prisma from "@/lib/prisma";
import { PageContent, SiteDetails, includePageContent, includeSiteDetails } from "@/types/site";
import { getCurrentSite } from "./site-crud-service";
import { getCurrentUserSession, requireUserId } from "./user-context-service";

/**
 * Get a site and page by subdomain and slug
 * Used for frontend site rendering
 */
export async function getSiteWithPage(
  subdomain: string,
  slug: string
): Promise<{
  site: SiteDetails | null;
  page: PageContent | null;
}> {
  const site = await prisma.site.findUnique({
    where: { subdomain },
    ...includeSiteDetails
  });

  if (!site) {
    return { site: null, page: null };
  }

  const page = await prisma.page.findFirst({
    where: {
      siteId: site.id,
      slug,
      draft: false
    },
    ...includePageContent
  });

  return { site, page };
}

/**
 * Get the homepage for a site by subdomain
 * Used for frontend site rendering
 */
export async function getHomepage(subdomain: string): Promise<{
  site: SiteDetails | null;
  page: PageContent | null;
}> {
  const site = await prisma.site.findUnique({
    where: { subdomain },
    ...includeSiteDetails
  });

  if (!site?.homepageId) {
    return { site, page: null };
  }

  const page = await prisma.page.findUnique({
    where: {
      id: site.homepageId,
      draft: false
    },
    ...includePageContent
  });

  return { site, page };
}

/**
 * Get a page by ID with its site details
 * Used for the dashboard editing page
 */
export async function getPageWithSiteById(id: string): Promise<{
  page: PageContent | null;
  site: SiteDetails | null;
}> {
  const userId = await requireUserId();

  const page = await prisma.page.findUnique({
    where: {
      id: decodeURIComponent(id),
      site: {
        organization: {
          members: {
            some: {
              userId
            }
          }
        }
      }
    },
    ...includePageContent
  });

  if (!page) {
    return { page: null, site: null };
  }

  const site = await prisma.site.findUnique({
    where: {
      id: page.siteId
    },
    ...includeSiteDetails
  });

  return { page, site };
}

/**
 * Find a page by subdomain and slug
 * Includes permissions check for draft pages
 */
export async function findPage(
  subdomain: string,
  slug: string
): Promise<{
  site: SiteDetails | null;
  page: PageContent | null;
}> {
  const user = await getCurrentUserSession();
  const site = await prisma.site.findUnique({
    where: { subdomain },
    ...includeSiteDetails
  });

  if (!site) {
    return { site: null, page: null };
  }

  // Check if user has permission to view drafts
  const page = await prisma.page.findFirst({
    where: {
      siteId: site.id,
      slug,
      OR: [
        // Either the page is not a draft
        { draft: false },
        // Or the user belongs to the organization that owns the site
        {
          draft: true,
          site: {
            organization: {
              members: {
                some: {
                  userId: user?.id
                }
              }
            }
          }
        }
      ]
    },
    ...includePageContent
  });

  return { site, page };
}

/**
 * Set a page as the homepage for a site
 */
export async function setHomepage(siteId: string, pageId: string) {
  const userId = await requireUserId();

  return await prisma.site.update({
    where: {
      id: siteId,
      organization: {
        members: {
          some: {
            userId // @NOTE: Stronger permission check possible here for setting homepage, if necessary
          }
        }
      }
    },
    data: {
      homepageId: pageId
    },
    select: {
      id: true
    }
  });
}

/**
 * Delete a page
 */
export async function deletePage(id: string) {
  const userId = await requireUserId();

  // First, retrieve the page along with the related site's homepageId
  const page = await prisma.page.findUnique({
    where: {
      id,
      site: {
        organization: {
          members: {
            some: {
              userId // @NOTE: Stronger permission check possible here for deleting pages, if necessary
            }
          }
        }
      }
    },
    select: {
      id: true,
      site: {
        select: {
          homepageId: true,
          organizationId: true
        }
      }
    }
  });

  if (!page) {
    throw new Error("Page not found.");
  }

  if (page.site.homepageId === id) {
    throw new Error("Cannot delete the homepage of a site.");
  }

  // If the checks pass, proceed to delete the page
  return await prisma.page.delete({
    where: { id }
  });
}

/**
 * Update a page's properties
 */
export async function updatePage(id: string, pageAttributes: Partial<Page>) {
  const userId = await requireUserId();

  const page = await prisma.page.findFirst({
    where: {
      id,
      site: {
        organization: {
          members: {
            some: {
              userId
            }
          }
        }
      }
    },
    select: {
      id: true
    }
  });

  if (!page) {
    return {
      error: "Page not found or you don't have permission to edit it"
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
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "Failed to update page"
    };
  }
}

/**
 * Create a new page for the current site
 */
export async function createPage() {
  const site = await getCurrentSite();

  if (!site) {
    throw new Error("Site not found.");
  }

  return await prisma.page.create({
    data: {
      siteId: site.id,
      content: newPageTemplate ?? ""
    },
    select: {
      id: true
    }
  });
}
