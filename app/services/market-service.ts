"use server";

import { Channel } from "@/app/generated/prisma";
import { getRootUrl } from "@/lib/domain";
import { getCurrentSite } from "./site/site-crud-service";
import { getPublishedTiersForOrganization } from "./tier/tier-service";
import { requireOrganization } from "./user-context-service";

const API_ENDPOINT = process.env.MARKET_DEV_API_ENDPOINT;
const API_KEY = process.env.MARKET_DEV_API_KEY;

type GithubEntityType = "User" | "Organization";

interface LinkExpertResponse {
  linked: boolean;
  expert?: {
    id: string;
    name: string;
    slug: string;
    uuid: string;
    host: string;
  };
}

/**
 * Links a GitHub user or organization to the current organization via the market.dev API
 * @param githubUserId - The GitHub user/organization ID to link to the organization
 * @param githubEntityType - The type of GitHub entity ("User" or "Organization")
 * @returns A boolean indicating if the linking was successful
 */
export async function linkGithubUserToOrganization(
  githubUserId: number,
  githubEntityType: GithubEntityType
): Promise<boolean> {
  try {
    const organization = await requireOrganization();

    const response = await fetch(`${API_ENDPOINT}store/experts/link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        store_id: organization.id,
        github_id: githubUserId,
        github_type: githubEntityType
      })
    });

    if (response.status !== 200) {
      return false;
    }

    const responseData = (await response.json()) as LinkExpertResponse;
    return responseData.linked === true;
  } catch (error) {
    console.error("Error linking GitHub user to organization:", error);
    return false;
  }
}

// @NOTE: TG-12/06/2025
// Below shouldn't be necessary anymore, as we are using embeds to show products on the market. Keeping here for now to ensure.
interface ServiceForSaleOnMarketDev {
  store_package_id: string;
  name: string;
  description: string | null;
  price: number | null;
  currency: string;
  created_at: string;
  updated_at: string;
}

type ServiceForSaleOnMarketDevParams = Omit<
  ServiceForSaleOnMarketDev,
  "user_id" | "created_at" | "updated_at"
>;

/**
 * @deprecated
 * Update services for sale on market.dev for current organization
 */
export async function updateServicesForSale() {
  const organization = await requireOrganization();

  // @TODO:
  // if (!organization.marketExpertId) {
  //   throw new Error("Organization is not an expert on Market.dev");
  // }

  const site = await getCurrentSite();
  if (!site) {
    throw new Error("Organization must have a site to sync with market");
  }

  if (!site.subdomain) {
    throw new Error("Organization must have a subdomain to sync with market");
  }

  const tiers = await getPublishedTiersForOrganization(organization.id, undefined, Channel.market);
  const serviceForSaleOnMarketDevParams: ServiceForSaleOnMarketDevParams[] = tiers.map((tier) => {
    return {
      store_package_id: tier.id,
      name: tier.name,
      description: tier.description,
      price: tier.price,
      currency: "usd"
    };
  });

  const response = await fetch(
    `${API_ENDPOINT}store/experts/nokey/sync_services`, // @TODO: API is used differently: /experts/${organization.marketExpertId}/sync_services
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        gitwallet_id: organization.id, // Use organization ID instead of user ID
        site_url: getRootUrl(site.subdomain!),
        services: serviceForSaleOnMarketDevParams
      })
    }
  );

  return response;
}
