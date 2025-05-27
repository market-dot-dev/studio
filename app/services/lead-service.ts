"use server";

import prisma from "@/lib/prisma";
import type { FiltersState } from "@/types/lead";
import { requireOrganization } from "./user-context-service";

// Environment variables and constants
const radarAPIEndpoint = process.env.RADAR_API_ENDPOINT;
const radarAPIKey = process.env.RADAR_API_KEY;

// Headers for API requests
const commonHeaders = {
  Authorization: `Token token="${radarAPIKey}"`
};

// Helper function (private)
function appendFiltersToUrl(url: string, filters: FiltersState) {
  Object.keys(filters).forEach((key) => {
    if (filters[key as keyof FiltersState]) {
      const encodedValue = encodeURIComponent(filters[key as keyof FiltersState] as string);
      url += `&${key}=${encodedValue}`;
    }
  });

  return url;
}

/**
 * Add a lead to the org's shortlist
 */
export async function addLeadToShortlist(leadData: any) {
  const org = await requireOrganization();

  const sanitizedLeads = {
    host: leadData.host,
    login: leadData.login,
    name: leadData.name ?? "",
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
    maintainers: leadData.maintainers || []
  };

  return await prisma.lead.upsert({
    where: {
      host_uuid_unique: {
        host: sanitizedLeads.host,
        uuid: sanitizedLeads.uuid
      }
    },
    update: {},
    create: {
      ...sanitizedLeads,
      organization: {
        connect: {
          id: org.id
        }
      }
    }
  });
}

/**
 * Remove a lead from the org's shortlist
 */
export async function removeLeadFromShortlist(leadId: number) {
  const org = await requireOrganization();
  return await prisma.lead.delete({
    where: {
      id: leadId,
      organizationId: org.id
    }
  });
}

/**
 * Get all leads in the shortlist
 */
export async function getShortlistedLeads() {
  const org = await requireOrganization();
  return await prisma.lead.findMany({
    where: {
      organizationId: org.id
    }
  });
}

/**
 * Get a list of lead identifiers from the shortlist
 */
export async function getShortlistedLeadsKeysList() {
  const org = await requireOrganization();
  return prisma.lead.findMany({
    where: {
      organizationId: org.id
    },
    select: {
      host: true,
      uuid: true
    }
  });
}

/**
 * Get facets for a repository
 */
export async function getFacets(radarId: number, filters: FiltersState) {
  let url = `${radarAPIEndpoint}repositories/${radarId}/dependent_owners/facets/?`;
  url = appendFiltersToUrl(url, filters);
  try {
    const response = await fetch(url, { headers: commonHeaders });
    return {
      data: await response.json()
    };
  } catch (error: any) {
    return {
      error: "Failed to get facets"
    };
  }
}

/**
 * Look up a repository by URL
 */
export async function lookup(repoUrl: string) {
  try {
    const response = await fetch(`${radarAPIEndpoint}repositories/lookup?url=${repoUrl}`, {
      headers: commonHeaders
    });
    return {
      data: await response.json()
    };
  } catch (error: any) {
    console.error(error);
    return {
      error: "Failed to lookup repository"
    };
  }
}

/**
 * Set up a repository for tracking
 */
export async function setup(repoUrl: string) {
  try {
    const response = await fetch(`${radarAPIEndpoint}repositories/setup?url=${repoUrl}`, {
      headers: commonHeaders
    });
    return {
      data: await response.json()
    };
  } catch (error: any) {
    return {
      error: "Failed to setup repository"
    };
  }
}

/**
 * Get packages for a repository
 */
export async function getPackages(radarId: number) {
  try {
    const response = await fetch(`${radarAPIEndpoint}repositories/${radarId}/packages`, {
      headers: commonHeaders
    });
    return {
      data: await response.json()
    };
  } catch (error: any) {
    return {
      error: "Failed to get packages"
    };
  }
}

/**
 * Get dependent owners for a repository
 */
export async function getDependentOwners(
  radarId: number,
  page: number,
  perPage: number,
  filters: FiltersState
) {
  let url = `${radarAPIEndpoint}repositories/${radarId}/dependent_owners?per_page=${perPage}&page=${page}`;

  url = appendFiltersToUrl(url, filters);

  try {
    const response = await fetch(url, { headers: commonHeaders });

    if (response.status === 404) {
      return {
        error: "No dependent owners found"
      };
    }
    return {
      data: await response.json()
    };
  } catch (error: any) {
    return {
      error: "Failed to get dependent owners"
    };
  }
}
