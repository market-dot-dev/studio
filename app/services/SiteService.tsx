"use server";

import prisma from "@/lib/prisma";
import { Site } from "@prisma/client";

import { revalidateTag } from "next/cache";

import { GitWalletError } from "@/lib/errors";
import { put } from "@vercel/blob";
import fs from "fs";
import yaml from "js-yaml";
import { customAlphabet } from "nanoid";
import SessionService from "./session-service";

const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7);

const loadReservedSubdomains = () => {
  try {
    const filePath = process.cwd() + "/config/reserved-subdomains.yaml"; // Adjust the path as necessary
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = yaml.load(fileContents);
    return data;
  } catch (e) {
    console.error(e);
    return []; // Return an empty array as a fallback
  }
};

const reservedSubdomains = loadReservedSubdomains() as string[];

class SiteService {
  static async getCurrentSite() {
    const userId = await SessionService.getCurrentUserId();

    if (!userId) {
      throw new Error("No user found.");
    }

    return SiteService.getOnlySiteFromUserId(userId);
  }

  static async getSiteInfo(siteId: string) {
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

  static async getSiteAndPages(id: string) {
    const userId = await SessionService.getCurrentUserId();
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

  static async getOnlySiteFromUserId(userId: string) {
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

  static async validateSubdomain(subdomain: string, currentSite?: Site) {
    // Validate subdomain format
    const subdomainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/;
    if (!subdomainRegex.test(subdomain)) {
      throw new GitWalletError("Subdomain provided is not valid");
    }

    // Check length constraints
    if (subdomain.length < 3 || subdomain.length > 63) {
      throw new GitWalletError("Subdomain must be between 3 and 63 characters long");
    }

    // Check reserved subdomains
    if (reservedSubdomains.includes(subdomain)) {
      throw new GitWalletError(`The subdomain "${subdomain}" is reserved and cannot be used`);
    }

    // Check if subdomain is already taken
    const existingSite = await prisma.site.findFirst({
      where: {
        subdomain,
        ...(currentSite && { NOT: { id: currentSite.id } })
      }
    });

    if (existingSite) {
      throw new GitWalletError(`The subdomain "${subdomain}" is already taken.`);
    }
  }

  static async uploadLogo(formData: FormData) {
    const file = formData.get("file") as File;
    return SiteService.uploadLogoFile(file);
  }

  static async uploadLogoFile(file: File) {
    const filename = `${nanoid()}.${file.type.split("/")[1]}`;
    const { url } = await put(filename, file, {
      access: "public"
    });

    return url;
  }

  static async updateCurrentSite(formData: FormData) {
    const site = (await SiteService.getCurrentSite()) as Site;
    try {
      const updateData: Partial<Site> = {};
      let hasSubdomainUpdate = false;

      for (const [key, value] of formData.entries()) {
        // Handle subdomain separately with validation
        if (key === "subdomain") {
          const subdomain = value.toString().toLocaleLowerCase();
          await SiteService.validateSubdomain(subdomain, site);
          updateData.subdomain = subdomain;
          hasSubdomainUpdate = true;
        } else if (key === "logo") {
          if (!process.env.BLOB_READ_WRITE_TOKEN) {
            throw new Error(
              "Missing BLOB_READ_WRITE_TOKEN token. Note: Vercel Blob is currently in beta – please fill out this form for access: https://tally.so/r/nPDMNd"
            );
          }

          const file = value as File;
          // Ensure there's a file to process
          const url = await SiteService.uploadLogoFile(file);
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
        await revalidateTag(`${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`);
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

  static async deleteSite(siteId: string) {
    return prisma.site.delete({
      where: { id: siteId }
    });
  }
}

export default SiteService;
export const {
  getCurrentSite,
  updateCurrentSite,
  getOnlySiteFromUserId,
  getSiteNav,
  getSiteAndPages,
  deleteSite,
  validateSubdomain,
  uploadLogo
} = SiteService;
