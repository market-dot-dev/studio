import { getRootUrl } from "@/lib/domain";
import { Channel } from "@prisma/client";
import { getCurrentSite } from "./SiteService";
import TierService from "./TierService";
import { getCurrentUser } from "./UserService";
const API_ENDPOINT = process.env.MARKET_DEV_API_ENDPOINT;
const API_KEY = process.env.MARKET_DEV_API_KEY;

interface Expert {
  id: string;
  name: string;
  slug: string;
  uuid: string;
  host: string;
}

interface ServicesForSaleOnMarketDev {
  services: ServiceForSaleOnMarketDev[];
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

interface ServiceForSaleOnMarketDevParams
  extends Omit<ServiceForSaleOnMarketDev, "user_id" | "created_at" | "updated_at"> {}

export class MarketService {
  static async getExpert(): Promise<Expert | null> {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not found");
    }

    try {
      const response = await fetch(`${API_ENDPOINT}store/experts/${user.gh_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`
        }
      });

      const data = await response.json();
      return data as Expert;
    } catch (error) {
      console.error(`Error getting Market expert for user ${user.gh_id}:`, error);
      return null;
    }
  }

  static async validateAccount() {
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

  static async userIsMarketExpert(): Promise<boolean> {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not found");
    }
    return !!user.marketExpertId;
  }

  static async getPublishedServices(): Promise<ServicesForSaleOnMarketDev | null> {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.marketExpertId) {
      throw new Error("User is not an expert on Market.dev");
    }

    const response = await fetch(`${API_ENDPOINT}store/experts/${user.marketExpertId}/services`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      }
    });

    const data = await response.json();
    if (!data.services) {
      return null;
    }

    return data as ServicesForSaleOnMarketDev;
  }

  static async updateServicesForSale() {
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
}

export const { getPublishedServices, userIsMarketExpert } = MarketService;
