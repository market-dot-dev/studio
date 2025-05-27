"use server";

import prisma from "@/lib/prisma";
import { generateId } from "@/lib/utils";
import { put } from "@vercel/blob";
import { getCurrentSite } from "./site-crud-service";

/**
 * Uploads a logo from form data
 * @param formData - Form data containing the logo file
 * @returns URL of the uploaded logo
 */
export async function uploadLogo(formData: FormData): Promise<string> {
  const fileObj = formData.get("file");

  if (!fileObj || !(fileObj instanceof File)) {
    throw new Error("No valid file provided");
  }

  return uploadLogoFile(fileObj);
}

/**
 * Uploads a logo file to storage
 * @param file - File object to upload
 * @returns URL of the uploaded logo
 */
export async function uploadLogoFile(file: File): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Missing BLOB_READ_WRITE_TOKEN token.");
  }

  const fileType = file.type.split("/")[1] || "unknown";
  const filename = `${generateId()}.${fileType}`; // @TODO: random ids might not be necessary with @vercel/blob v1 anymore

  const { url } = await put(filename, file, {
    access: "public"
  });

  return url;
}

/**
 * Updates the logo for the current site
 * @param logoUrl - URL of the new logo
 * @returns Boolean indicating success
 */
export async function updateSiteLogo(logoUrl: string): Promise<boolean> {
  const site = await getCurrentSite();

  if (!site) {
    console.error("No site found");
    return false;
  }

  try {
    await prisma.site.update({
      where: { id: site.id },
      data: { logo: logoUrl }
    });

    return true;
  } catch (error) {
    console.error("Failed to update site logo:", error);
    return false;
  }
}
