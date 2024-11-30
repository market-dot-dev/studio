"use server";

import { Media } from "@prisma/client";
import prisma from "@/lib/prisma";

import { customAlphabet } from "nanoid";

import { put, del } from "@vercel/blob";

import SiteService from "./SiteService";

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7,
);

class MediaService {
  static async uploadFile(formData: any): Promise<Partial<Media> | null> {
    const currentSite = await SiteService.getCurrentSite();
    const siteId = currentSite?.id;

    if (!siteId) {
      console.error("No site found.");
      return null;
    }

    try {
      // Extract file from formData
      const file = formData.get("file");

      // Validate file and userId presence
      if (!file || !siteId) {
        console.error("File or siteId missing in the formData.");
        return null;
      }

      const filename = `${nanoid()}.${file.type.split("/")[1]}`;
      const { url } = await put(filename, file, {
        access: "public",
      });

      // Create a record in the database
      const media = await prisma.media.create({
        data: {
          siteId,
          url,
        },
      });

      return media;
    } catch (error) {
      console.error("Failed to upload file and create media record:", error);
      return null;
    }
  }

  static async getMedia(mediaId: string): Promise<Media | null> {
    const currentSite = await SiteService.getCurrentSite();
    const siteId = currentSite?.id;

    if (!siteId) {
      console.error("No site found.");
      return null;
    }

    try {
      const media = await prisma.media.findFirst({
        where: {
          id: mediaId,
          siteId,
        },
      });
      return media;
    } catch (error) {
      console.error("Failed to get media:", error);
      return null;
    }
  }

  static async deleteMedia(mediaId: string): Promise<boolean> {
    const media = await MediaService.getMedia(mediaId);

    if (!media) {
      console.error("Cant find relevant file to delte.");
      return false;
    }

    try {
      await del(media.url);
      await prisma.media.delete({
        where: {
          id: media.id,
        },
      });
      return true;
    } catch (error) {
      console.error("Failed to delete media:", error);
      return false;
    }
  }

  static async listMedia(): Promise<Media[]> {
    const currentSite = await SiteService.getCurrentSite();
    const siteId = currentSite?.id;

    if (!siteId) {
      console.error("No site found.");
      return [];
    }

    try {
      const mediaItems = await prisma.media.findMany({
        where: {
          siteId,
        },
      });

      return mediaItems;
    } catch (error) {
      console.error("Failed to list media for site:", error);
      return [];
    }
  }
}

export default MediaService;
export const { uploadFile, listMedia, deleteMedia } = MediaService;
