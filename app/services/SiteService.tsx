"use server";

import prisma from "@/lib/prisma";
import { Site } from "@prisma/client";

import { GitWalletError } from "@/lib/errors";
import { put } from "@vercel/blob";
import fs from "fs";
import yaml from "js-yaml";
import { customAlphabet } from "nanoid";

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
}

export default SiteService;
export const { getSiteNav, validateSubdomain, uploadLogo } = SiteService;
