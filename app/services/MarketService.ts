"use server";

import { getRootUrl } from "@/lib/domain";
import { Channel } from "@prisma/client";
import { getCurrentSite } from "./SiteService";
import TierService from "./tier-service";
import UserService, { getCurrentUser } from "./UserService";

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
 * Validates the current user as a market expert and updates their profile if successful
 * @returns A boolean indicating if the validation was successful
 */
export async function validateMarketExpert(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return false;
    }

    // If user is already an expert, return true immediately
    if (user.marketExpertId) {
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

    // Update user with expert ID
    await UserService.updateUser(user.id, {
      marketExpertId: expert.id.toString()
    });

    return true;
  } catch (error) {
    console.error("Error validating market expert:", error);
    return false;
  }
}

/**
 * Checks if the current user is already a market expert in the db
 * @returns A boolean indicating if the user is a market expert
 */
export async function userIsMarketExpert(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not found");
  }
  return !!user.marketExpertId;
}

/**
 * Validate account with the market.dev API
 * This is an internal function used by validateMarketExpert
 */
export async function validateAccount() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not found");
  }

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
      store_id: user.id,
      github_id: user.gh_id
    })
  });

  return response;
}

/**
 * Update services for sale on market.dev
 */
export async function updateServicesForSale() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not found");
  }

  if (!user.marketExpertId) {
    throw new Error("User is not an expert on Market.dev");
  }
  const site = await getCurrentSite();
  if (!site) {
    throw new Error("User must have a site to sync with market");
  }

  if (!site.subdomain) {
    throw new Error("User must have a subdomain to sync with market");
  }

  const tiers = await TierService.getTiersForUser(user.id, undefined, Channel.market);
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
    `${API_ENDPOINT}store/experts/${user.marketExpertId}/sync_services`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        gitwallet_id: user.id,
        site_url: getRootUrl(site.subdomain!),
        services: serviceForSaleOnMarketDevParams
      })
    }
  );

  return response;
}
