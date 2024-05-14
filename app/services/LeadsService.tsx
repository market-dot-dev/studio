"use server";

import { FiltersState } from "@/components/leads/filters-panel";
import SessionService from "./SessionService";
import prisma from "@/lib/prisma";

const radarAPIEndpoint = process.env.RADAR_API_ENDPOINT;
const radarAPIKey = process.env.RADAR_API_KEY;

const appendFiltersToUrl = (url: string, filters: FiltersState) => {
    Object.keys(filters).forEach((key) => {
        if (filters[key as keyof FiltersState]) {
            const encodedValue = encodeURIComponent(filters[key as keyof FiltersState] as string);
            url += `&${key}=${encodedValue}`;
        }
    });

    return url;
}

class LeadsService {
    static commonHeaders = {
        'Authorization': `Token token="${radarAPIKey}"`
    };

    static async getDependentRepostories() {
        // Add your logic here
    }

    static async getDependentUsers(id: string) {
        // Add your logic here
    }

    static async getDependentPackages() {
        // Add your logic here
    }

    static async addLeadToShortlist(leadData: any) {
      
        const userId = await SessionService.getCurrentUserId();
        
        
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
            icon_url: leadData.icon_url,
            repositories_count: leadData.repositories_count || 0,
            last_synced_at: new Date(leadData.last_synced_at),
            html_url: leadData.html_url,
            total_stars: leadData.total_stars || null,
            dependent_repos_count: leadData.dependent_repos_count,
            followers: leadData.followers || null,
            following: leadData.following || null,
            maintainers: leadData.maintainers || [],
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
            user: {
              connect: {
                id: userId,
            },
            },
          },
        });
    }

    static async removeLeadFromShortlist(leadId: number) {
        const userId = await SessionService.getCurrentUserId();
        return await prisma.lead.delete({
            where: {
                id: leadId,
                userId,
                
            }
        });
    }

    static async getShortlistedLeads() {
        const userId = await SessionService.getCurrentUserId();
        return await prisma.lead.findMany({
            where: {
                userId
            }
        });
    }

    static async getShortlistedLeadsKeysList() {
        const userId = await SessionService.getCurrentUserId();
        return prisma.lead.findMany({
            where: {
                userId
            },
            select: {
                host: true,
                uuid: true
            }
        });
    }

    static async getFacets(radarId: number, filters: FiltersState) {
        let url = `${radarAPIEndpoint}repositories/${radarId}/dependent_owners/facets/?`;
        url = appendFiltersToUrl(url, filters);
        try {
            const response = await fetch(url, { headers: LeadsService.commonHeaders });
            return {
                data: await response.json()
            }
        } catch (error: any) {
            return {
                error: 'Failed to get facets'
            }
        }
    }

    static async lookup(repoUrl: string) {
        try {
            const response = await fetch(`${radarAPIEndpoint}repositories/lookup?url=${repoUrl}`, { headers: LeadsService.commonHeaders });
            return {
                data: await response.json()
            }
        } catch (error: any) {
            return {
                error: 'Failed to lookup repository'
            }
        }
    }

    static async setup(repoUrl: string) {
        try {
            const response = await fetch(`${radarAPIEndpoint}repositories/setup?url=${repoUrl}`, { headers: LeadsService.commonHeaders });
            return {
                data: await response.json()
            }
        } catch (error: any) {
            return {
                error: 'Failed to setup repository'
            }
        }
    }


    static async getDependentOwners(radarId: number, page: number, perPage: number, filters: FiltersState) {
        
        let url = `${radarAPIEndpoint}repositories/${radarId}/dependent_owners?per_page=${perPage}&page=${page}`;
        
        url = appendFiltersToUrl(url, filters)

        // Add your logic here
        try {
            const response = await fetch(url, { headers: LeadsService.commonHeaders });
            
            // if it is 404 return empty array
            if (response.status === 404) {
                return {
                    error: 'No dependent owners found'
                };
            }
            return {
                data: await response.json()
            }
        } catch (error: any) {
            // rethrow the error
            return {
                error: 'Failed to get dependent owners'
            }
        }
    }

}

export default LeadsService;
export const { getDependentOwners, addLeadToShortlist, getShortlistedLeads, getShortlistedLeadsKeysList, lookup, removeLeadFromShortlist, getFacets } = LeadsService;
