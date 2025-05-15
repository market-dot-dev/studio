"use server";

import { Site } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { getCurrentUserId } from "./session-service";
import { uploadLogoFile } from "./site-media-service";
import { validateSubdomain } from "./site-subdomain-service";

/**
 * Retrieves the current site for the logged-in user
 * @returns The current site or null if not found
 * @throws Error if no user is logged in
 */
export async function getCurrentSite(): Promise<Site | null> {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("No user found.");
  }

  return getOnlySiteFromUserId(userId);
}

/**
 * Retrieves site information by site ID
 * @param siteId - ID of the site to retrieve
 * @returns Site information including user details
 */
export async function getSiteInfo(siteId: string) {
  const site = await prisma.site.findUnique({
    where: {
      id: siteId
    },
    select: {
      userId: true,
      logo: true,
      subdomain: true,
      user: {
        select: {
          projectName: true,
          projectDescription: true
        }
      }
    }
  });
  return site;
}

/**
 * Retrieves a site and its pages by ID
 * @param id - ID of the site to retrieve
 * @returns Site with pages included
 */
export async function getSiteAndPages(id: string) {
  const userId = await getCurrentUserId();
  const site = await prisma.site.findUnique({
    where: {
      id: decodeURIComponent(id),
      userId
    },
    include: {
      pages: true
    }
  });
  return site;
}

/**
 * Retrieves the first site for a user
 * @param userId - User ID to find site for
 * @returns The first site or null if not found
 */
export async function getOnlySiteFromUserId(userId: string): Promise<Site | null> {
  const site = await prisma.site.findFirst({
    where: {
      userId
    },
    orderBy: {
      createdAt: "asc"
    }
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
  const site = (await getCurrentSite()) as Site;
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

        // Ensure there's a file to process
        const url = await uploadLogoFile(fileObj);
        updateData.logo = url;
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
 * Deletes a site by ID
 * @param siteId - ID of the site to delete
 * @returns The deleted site
 */
export async function deleteSite(siteId: string) {
  return prisma.site.delete({
    where: { id: siteId }
  });
}
