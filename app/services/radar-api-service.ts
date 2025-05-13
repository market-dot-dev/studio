"use server";

import { FiltersState } from "./research-service";

const radarAPIEndpoint = process.env.RADAR_API_ENDPOINT;
const radarAPIKey = process.env.RADAR_API_KEY;

const commonHeaders = {
  Authorization: `Token token="${radarAPIKey}"`
};

// Helper functions
function appendFiltersToUrl(url: string, filters: FiltersState) {
  Object.keys(filters).forEach((key) => {
    if (filters[key as keyof FiltersState]) {
      const encodedValue = encodeURIComponent(filters[key as keyof FiltersState] as string);
      url += `&${key}=${encodedValue}`;
    }
  });
  return url;
}

// Radar API methods
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
