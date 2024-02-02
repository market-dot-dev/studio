"use server";

import { Site, User } from '@prisma/client';
import prisma from "@/lib/prisma";

import { revalidateTag } from 'next/cache';

import { customAlphabet } from "nanoid";
import { getBlurDataURL } from "@/lib/utils";
import { put } from "@vercel/blob";
import { getCurrentUserId } from './UserService';

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7,
);

const reservedSubdomains = ['www', 'mail', 'admin', 'blog', 'ftp', 'webmail'];

class SiteService {

    static async getCurrentSite() {
        const userId = await getCurrentUserId();

        if (!userId) {
            throw new Error('No user found.');
        }

        return SiteService.getOnlySiteFromUserId(userId);
    }

    static async getOnlySiteFromUserId(userId: string)  {
        const site = await prisma.site.findFirst({
          where: {
            userId,
          },
        });
        return site;
      }

    static async updateCurrentSite(formData: FormData) {
        const site = await SiteService.getCurrentSite() as Site;
        try {
            let updateData: Partial<Site> = {};
            let hasSubdomainUpdate = false;
            
            for (let [key, value] of formData.entries()) {
                
                // Handle subdomain separately with validation
                if (key === 'subdomain') {
                    const subdomain = value.toString();
                    if (reservedSubdomains.includes(subdomain)) {
                        throw new Error(`The subdomain "${subdomain}" is reserved and cannot be used.`);
                    }
                    updateData.subdomain = subdomain;
                    hasSubdomainUpdate = true;
                }  else if (key === "logo") {
                    if (!process.env.BLOB_READ_WRITE_TOKEN) {
                        throw new Error("Missing BLOB_READ_WRITE_TOKEN token. Note: Vercel Blob is currently in beta – please fill out this form for access: https://tally.so/r/nPDMNd");
                    }
    
                    const file = value as File;
                    // Ensure there's a file to process
                    
                    const filename = `${nanoid()}.${file.type.split("/")[1]}`;
                    const { url } = await put(filename, file, {
                        access: "public",
                    });

                    updateData.logo = url;
                    
                }
            }

            // Perform the update with the constructed data
            const response = await prisma.site.update({
                where: { id: site.id },
                data: updateData,
            });

            // Revalidation if subdomain is updated
            if (hasSubdomainUpdate) {
                await revalidateTag(`${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`);
                console.log("Updated site data! Revalidating tags: ", `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`);
            }

            return { message: "Site updated successfully", response };
        } catch (error: any) {
            console.error("Error updating site: ", error);
            return {
                error: error.code === "P2002" ? `This value is already taken.` : error.message,
            };
        }
    }

}

export default SiteService;
export const { updateCurrentSite, getOnlySiteFromUserId } = SiteService;