import { Prisma } from "@/app/generated/prisma";

/**
 * Type for basic site details
 */
export const includeSiteDetails = Prisma.validator<Prisma.SiteDefaultArgs>()({
  select: {
    id: true,
    name: true,
    subdomain: true,
    customDomain: true,
    logo: true,
    message404: true,
    organization: {
      select: {
        id: true,
        name: true,
        projectName: true,
        projectDescription: true
      }
    },
    homepageId: true
  }
});

export type SiteDetails = Prisma.SiteGetPayload<typeof includeSiteDetails>;

/**
 * Type for basic page content
 */
export const includePageContent = Prisma.validator<Prisma.PageDefaultArgs>()({
  select: {
    id: true,
    title: true,
    slug: true,
    content: true,
    draft: true,
    createdAt: true,
    updatedAt: true,
    siteId: true
  }
});

export type PageContent = Prisma.PageGetPayload<typeof includePageContent>;

/**
 * Type for site with all its pages
 */
export const includeSiteWithPages = Prisma.validator<Prisma.SiteDefaultArgs>()({
  select: {
    ...includeSiteDetails.select,
    pages: {
      select: includePageContent.select
    }
  }
});

export type SiteWithPages = Prisma.SiteGetPayload<typeof includeSiteWithPages>;

/**
 * Component type definitions for the page renderer
 */
export interface ComponentType {
  element: React.ComponentType<any>;
  preview?: React.ComponentType<any>;
  ui?: boolean;
}
