"use server";

import { User, Media } from '@prisma/client';
import prisma from "@/lib/prisma";

import { customAlphabet } from "nanoid";

import { put } from "@vercel/blob";

import { getCurrentUserId } from './UserService';

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7,
);

class MediaService {

    static async uploadFile(formData: any): Promise<Partial<Media> | null> {

        const userId = await getCurrentUserId();
        
        if( !userId ) {
            console.error("No user found.");
            return null;
        }

        try {
          // Extract file from formData
          const file = formData.get("file");
    
          // Validate file and userId presence
          if (!file || !userId) {
            console.error("File or userId missing in the formData.");
            return null;
          }
    
          const filename = `${nanoid()}.${file.type.split("/")[1]}`;;
          const { url } = await put(filename, file, {
            access: "public",
          });
    
          // Create a record in the database
          const media = await prisma.media.create({
            data: {
              userId,
              url,
            },
          });
    
          return media;
        } catch (error) {
          console.error("Failed to upload file and create media record:", error);
          return null;
        }
      }
    
    static async listMedia(): Promise<Media[]> {
      const userId = await getCurrentUserId();
        
      if( !userId ) {
          console.error("No user found.");
          return [];
      }

        try {
          const mediaItems = await prisma.media.findMany({
            where: {
              userId,
            },
          });
    
          return mediaItems;
        } catch (error) {
          console.error("Failed to list media for user:", error);
          return [];
        }
      }
}

export default MediaService;
export const { uploadFile, listMedia } = MediaService;