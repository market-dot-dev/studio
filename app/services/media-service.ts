"use server";

import prisma from "@/lib/prisma";
import { Media } from "@prisma/client";
import { del, put } from "@vercel/blob";
import { customAlphabet } from "nanoid";
import { getCurrentSite } from "./SiteService";

const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7);

/**
 * Uploads a file to storage and creates a media record in the database
 * @param formData - Form data containing the file to upload
 * @returns The created media record or null if upload fails
 */
export async function uploadMedia(formData: any): Promise<Partial<Media> | null> {
  const currentSite = await getCurrentSite();
  const siteId = currentSite?.id;

  if (!siteId) {
    console.error("No site found.");
    return null;
  }

  try {
    // Extract file from formData
    const file = formData.get("file");

    // Validate file and siteId presence
    if (!file || !siteId) {
      console.error("File or siteId missing in the formData.");
      return null;
    }

    const filename = `${nanoid()}.${file.type.split("/")[1]}`;
    const { url } = await put(filename, file, {
      access: "public"
    });

    // Create a record in the database
    const media = await prisma.media.create({
      data: {
        siteId,
        url
      }
    });

    return media;
  } catch (error) {
    console.error("Failed to upload file and create media record:", error);
    return null;
  }
}

/**
 * Retrieves a media record by ID
 * @param mediaId - ID of the media to retrieve
 * @returns The media record or null if not found
 */
export async function getMedia(mediaId: string): Promise<Media | null> {
  const currentSite = await getCurrentSite();
  const siteId = currentSite?.id;

  if (!siteId) {
    console.error("No site found.");
    return null;
  }

  try {
    const media = await prisma.media.findFirst({
      where: {
        id: mediaId,
        siteId
      }
    });
    return media;
  } catch (error) {
    console.error("Failed to get media:", error);
    return null;
  }
}

/**
 * Deletes a media record and its associated file
 * @param mediaId - ID of the media to delete
 * @returns True if deletion was successful, false otherwise
 */
export async function deleteMedia(mediaId: string): Promise<boolean> {
  const media = await getMedia(mediaId);

  if (!media) {
    console.error("Can't find relevant file to delete.");
    return false;
  }

  try {
    await del(media.url);
    await prisma.media.delete({
      where: {
        id: media.id
      }
    });
    return true;
  } catch (error) {
    console.error("Failed to delete media:", error);
    return false;
  }
}

/**
 * Lists all media records for the current site
 * @returns Array of media records
 */
export async function listMedia(): Promise<Media[]> {
  const currentSite = await getCurrentSite();
  const siteId = currentSite?.id;

  if (!siteId) {
    console.error("No site found.");
    return [];
  }

  try {
    const mediaItems = await prisma.media.findMany({
      where: {
        siteId
      }
    });

    return mediaItems;
  } catch (error) {
    console.error("Failed to list media for site:", error);
    return [];
  }
}
