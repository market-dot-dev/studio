"use server";

import SessionService from "./SessionService";
import prisma from "@/lib/prisma";

class LeadsService {
    static async getDependentRepostories() {
        // Add your logic here
    }

    static async getDependentUsers(id: string) {
        // Add your logic here
    }

    static async getDependentPackages() {
        // Add your logic here
    }

    static async addLeadToShortlist(leadData: any, repoId: string) {
      
        const userId = await SessionService.getCurrentUserId();
        
        // check if the user owns the repo
        const repo = await prisma.repo.findFirst({
            where: {
                id: repoId,
                userId,
            }
        });

        if (!repo) {
            throw new Error('The repository is not part of the installation.');
        }
        
        const sanitizedLeads = {
            host: leadData.host,
            login: leadData.login,
            name: leadData.name ?? '',
            uuid: leadData.uuid,
            kind: leadData.kind,
            description: leadData.description || null,
            email: leadData.email || null,
            website: leadData.website || null,
            location: leadData.location || null,
            twitter: leadData.twitter || null,
            company: leadData.company || null,
            iconUrl: leadData.icon_url,
            repositoriesCount: leadData.repositories_count || 0,
            lastSyncedAt: new Date(leadData.last_synced_at),
            htmlUrl: leadData.html_url,
            totalStars: leadData.total_stars || null,
            dependentReposCount: leadData.dependent_repos_count,
            followers: leadData.followers || null,
            following: leadData.following || null,
            createdAt: new Date(leadData.created_at), 
            updatedAt: new Date(leadData.updated_at),
            maintainers: JSON.stringify(leadData.maintainers || []),
        }

        return await prisma.lead.upsert({
          where: {
            host_uuid_unique: {
              host: sanitizedLeads.host,
              uuid: sanitizedLeads.uuid,
            },
          },
          update: {
          },
          create: {
            ...sanitizedLeads,
            repo: {
              connect: {
                id: repoId,
              },
            },
          },
        });
    }

    static async getShortlistedLeads() {
        const userId = await SessionService.getCurrentUserId();
        return await prisma.lead.findMany({
            where: {
                repo : {
                  userId,
                }
            },
            include: {
                repo: {
                    select: {
                        id: true,
                        name: true,
                        url: true,
                    }
                
                }
            }
        });
    }

    static async getShortlistedLeadsKeysList(dbRepoId: string) {
        const userId = await SessionService.getCurrentUserId();
        return prisma.lead.findMany({
            where: {
                dbRepoId,
                repo : {
                  userId,
                }
            },
            select: {
                host: true,
                uuid: true
            }
        });
    }

    static async lookup(repoUrl: string) {
        const response = await fetch(`https://radar-api.ecosyste.ms/api/v1/repositories/lookup?url=${repoUrl}`);
        return response.json();
    }

    static async getDependentOwners(radarId: number) {
        // Add your logic here
        const response = await fetch(`https://radar-api.ecosyste.ms/api/v1/repositories/${radarId}/dependent_owners`);
        // if it is 404 return empty array
        if (response.status === 404) {
            return [];
        }
        return response.json();
    }

}

export default LeadsService;
export const { getDependentOwners, addLeadToShortlist, getShortlistedLeads, getShortlistedLeadsKeysList } = LeadsService;
