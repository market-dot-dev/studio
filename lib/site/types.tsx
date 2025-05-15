import { Prisma } from "@/app/generated/prisma";

/**
 * Prisma validator for site data with minimal fields
 */
export const includeSiteMeta = Prisma.validator<Prisma.SiteDefaultArgs>()({
  select: {
    id: true,
    userId: true,
    subdomain: true,
    homepageId: true
  }
});

/**
 * Minimal site data type
 */
export type SiteMeta = Prisma.SiteGetPayload<typeof includeSiteMeta>;

/**
 * Component type definitions for the page renderer
 */
export interface ComponentType {
  element: React.ComponentType<any>;
  preview?: React.ComponentType<any>;
  ui?: boolean;
}
