import { Channel } from "@prisma/client";
import TierService, { TierWithFeatures } from "./TierService";
import { getCurrentUser } from "./UserService";
import { getCurrentSite } from "./SiteService";
import { getRootUrl } from "@/lib/domain";
const API_ENDPOINT = process.env.MARKET_DEV_API_ENDPOINT;
const API_KEY = process.env.MARKET_DEV_API_KEY;

interface PackagesForSaleOnMarketDev {
  packages: PackageForSaleOnMarketDev[];
}

interface PackageForSaleOnMarketDev {
  package_id: string;
  package_name: string;
  package_description: string | null;
  package_price: number | null;
  currency: string;
  created_at: string;
  updated_at: string;
}

interface PackageForSaleOnMarketDevParams
  extends Omit<
    PackageForSaleOnMarketDev,
    "user_id" | "created_at" | "updated_at"
  > {}

export class MarketService {
  static async validateAccount() {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.gh_id) {
      throw new Error("User GitHub ID doesn't exist");
    }

    const response = await fetch(`${API_ENDPOINT}store/users/${user.id}/link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        github_id: user.gh_id,
      }),
    });

    return response;
  }

  static async getPublishedPackages(): Promise<PackagesForSaleOnMarketDev | null> {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.marketExpertId) {
      throw new Error("User is not an expert on Market.dev");
    }

    const response = await fetch(
      `${API_ENDPOINT}users/${user.id}/packages_for_sale`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      },
    );

    const data = await response.json();
    if (!data.packages) {
      return null;
    }

    return data as PackagesForSaleOnMarketDev;
  }

  static async updatePackagesForSale() {
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

    const tiers = await TierService.getTiersForUser(
      user.id,
      undefined,
      Channel.market,
    );
    const packageForSaleOnMarketDevParams: PackageForSaleOnMarketDevParams[] =
      tiers.map((tier) => {
        return {
          package_id: tier.id,
          package_name: tier.name,
          package_description: tier.description,
          package_price: tier.price,
          currency: "usd",
        };
      });

    const response = await fetch(
      `${API_ENDPOINT}store/users/${user.id}/packages_for_sale`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          gitwallet_id: user.id,
          site_url: getRootUrl(site.subdomain!),
          packages: packageForSaleOnMarketDevParams,
        }),
      },
    );

    return response;
  }
}

export const { getPublishedPackages } = MarketService;
