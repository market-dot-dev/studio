"use server";

import { Channel } from "@/app/generated/prisma";
import { getRootUrl } from "@/lib/domain";
import { updateOrganization } from "./organization/organization-service";
import { getCurrentSite } from "./site/site-crud-service";
import { getPublishedTiersForOrganization } from "./tier/tier-service";
import { requireOrganization, requireUser } from "./user-context-service";

const API_ENDPOINT = process.env.MARKET_DEV_API_ENDPOINT;
const API_KEY = process.env.MARKET_DEV_API_KEY;

interface LinkGitWalletResponse {
  linked: boolean;
  expert?: {
    id: string;
    name: string;
    slug: string;
    uuid: string;
    host: string;
  };
}

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
 * Validates the current organization as a market expert and updates the organization if successful
 * @returns A boolean indicating if the validation was successful
 */
export async function validateMarketExpert(): Promise<boolean> {
  try {
    const organization = await requireOrganization();
    // If organization is already a market expert, return true immediately
    if (organization.marketExpertId) {
      return true;
    }

    const response = await validateAccount();
    if (response.status !== 200) {
      return false;
    }

    const responseData = (await response.json()) as LinkGitWalletResponse;
    const { linked, expert } = responseData;

    if (!linked || !expert) {
      return false;
    }

    // Update organization with expert ID
    await updateOrganization(organization.id, {
      marketExpertId: expert.id.toString()
    });

    return true;
  } catch (error) {
    console.error("Error validating market expert:", error);
    return false;
  }
}

/**
 * Checks if the current organization is already a market expert
 * @returns A boolean indicating if the organization is a market expert
 */
export async function organizationIsMarketExpert(): Promise<boolean> {
  const organization = await requireOrganization();
  return !!organization.marketExpertId;
}

/**
 * Validate account with the market.dev API
 * This is an internal function used by validateMarketExpert
 */
export async function validateAccount() {
  const user = await requireUser();
  const organization = await requireOrganization();

  if (!user.gh_id) {
    throw new Error("User GitHub ID doesn't exist");
  }

  const response = await fetch(`${API_ENDPOINT}store/experts/link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      store_id: organization.id, // Use organization ID instead of user ID
      github_id: user.gh_id
    })
  });

  return response;
}

/**
 * Update services for sale on market.dev for current organization
 */
export async function updateServicesForSale() {
  const organization = await requireOrganization();

  if (!organization.marketExpertId) {
    throw new Error("Organization is not an expert on Market.dev");
  }

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
    `${API_ENDPOINT}store/experts/${organization.marketExpertId}/sync_services`,
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
