"use server";

import { Site } from "@/app/generated/prisma";
import {
  homepageTemplate,
  homepageTitle,
  siteDescription,
  siteName
} from "@/lib/constants/site-template";
import prisma from "@/lib/prisma";
import { includeSiteDetails, type SiteDetails } from "@/types/site";
import { revalidateTag } from "next/cache";
import { requireOrganization, requireUserId } from "../user-context-service";
import { uploadLogoFile } from "./site-media-service";
import { validateSubdomain } from "./site-subdomain-service";

/**
 * Retrieves the current site for the active Organization
 * @returns The current site or null if not found
 */
export async function getCurrentSite() {
  const org = await requireOrganization();
  return getSiteByOrgId(org.id);
}

/**
 * Retrieves site information by site ID
 * @param siteId - ID of the site to retrieve
 * @returns SiteDetails information including organization details
 */
export async function getSiteInfo(siteId: string): Promise<SiteDetails | null> {
  const site = await prisma.site.findUnique({
    where: {
      id: siteId
    },
    ...includeSiteDetails
  });
  return site;
}

/**
 * Retrieves a site and its pages by ID
 * @param id - ID of the site to retrieve
 * @returns Site with pages included
 */
export async function getSiteAndPages(id: string) {
  const userId = await requireUserId();

  const site = await prisma.site.findUnique({
    where: {
      id: decodeURIComponent(id),
      organization: {
        members: {
          some: {
            userId
          }
        }
      }
    },
    include: {
      pages: true
    }
  });
  return site;
}

/**
 * Retrieves the site of an organization
 * @param organizationId - Org ID to find site for
 * @returns The first site or null if not found
 */
export async function getSiteByOrgId(organizationId: string): Promise<SiteDetails | null> {
  const site = await prisma.site.findFirst({
    where: {
      organizationId
    },
    orderBy: {
      createdAt: "asc"
    },
    ...includeSiteDetails
  });
  return site;
}

/**
 * Updates the current site with data from form submission
 * @param formData - Form data containing site updates
 * @returns Message and response data
 * @throws Error if update fails
 */
export async function updateCurrentSite(formData: FormData) {
  const site = await getCurrentSite();
  if (!site) {
    throw new Error("Site not found");
  }
  try {
    const updateData: Partial<Site> = {};
    let hasSubdomainUpdate = false;

    for (const [key, value] of formData.entries()) {
      // Handle subdomain separately with validation
      if (key === "subdomain") {
        const subdomain = value.toString().toLocaleLowerCase();
        await validateSubdomain(subdomain, site);
        updateData.subdomain = subdomain;
        hasSubdomainUpdate = true;
      } else if (key === "logo") {
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
          throw new Error(
            "Missing BLOB_READ_WRITE_TOKEN token. Note: Vercel Blob is currently in beta – please fill out this form for access: https://tally.so/r/nPDMNd"
          );
        }

        const fileObj = value;
        if (!(fileObj instanceof File)) {
          throw new Error("Invalid file object");
        }

        // Only upload if file has content
        if (fileObj.size > 0) {
          const url = await uploadLogoFile(fileObj);
          updateData.logo = url;
        }
      } else if (key === "logoURL") {
        updateData.logo = value.toString();
      } else if (key === "name") {
        updateData.name = value.toString();
      }
    }

    // Perform the update with the constructed data
    const response = await prisma.site.update({
      where: { id: site.id },
      data: updateData
    });

    // Revalidation if subdomain is updated
    if (hasSubdomainUpdate) {
      revalidateTag(`${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`);
      console.log(
        "Updated site data! Revalidating tags: ",
        `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`
      );
    }

    return { message: "Site updated successfully", response };
  } catch (error: any) {
    console.error("Error updating site: ", error);
    throw error;
  }
}

/**
 * Creates a new site for an organization with initial homepage
 * @param organizationId - ID of the organization to create the site for
 * @param subdomain - Optional subdomain for the site
 * @param logo - Optional logo URL for the site
 * @returns The created site with its pages
 */
export async function createSite(organizationId: string, subdomain?: string, logo?: string) {
  // Create site and homepage in a single transaction
  const site = await prisma.site.create({
    data: {
      name: siteName,
      description: siteDescription,
      subdomain,
      logo,
      organization: {
        connect: {
          id: organizationId
        }
      },
      pages: {
        create: [
          {
            title: homepageTitle,
            slug: "index",
            content: homepageTemplate,
            draft: false
          }
        ]
      }
    },
    include: {
      pages: true
    }
  });

  // Set the first page as homepage
  if (site.pages.length > 0) {
    await prisma.site.update({
      where: { id: site.id },
      data: { homepageId: site.pages[0].id }
    });
  }

  return site;
}
