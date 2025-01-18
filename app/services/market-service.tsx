import { getCurrentUser } from "./UserService";
const API_ENDPOINT = process.env.MARKET_DEV_API_ENDPOINT;
const API_KEY = process.env.MARKET_DEV_API_KEY;

interface ExpertPackages {
  site: string;
  packages: string[];
}

export class MarketService {
  static async validateAccount() {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.gh_id) {
      throw new Error("User GitHub ID doesn't exist");
    }

    const response = await fetch(`${API_ENDPOINT}users/link_gitwallet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        gitwallet_id: user.id,
        github_id: user.gh_id,
      }),
    });

    return response;
  }

  static async getPublishedPackagesForExpert(): Promise<ExpertPackages | null> {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.marketExpertId) {
      throw new Error("User is not an expert on Market.dev");
    }

    const response = await fetch(
      `${API_ENDPOINT}experts/${user.marketExpertId}/packages_for_sale`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      },
    );

    const data = await response.json();
    if (!data.site || !data.packages) {
      return null;
    }

    return data as ExpertPackages;
  }

  static async updatePublishedPackagesForExpert(
    site: string,
    packageIds: string[],
  ) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.marketExpertId) {
      throw new Error("User is not an expert on Market.dev");
    }

    console.log(
      `request url`,
      `${API_ENDPOINT}experts/${user.marketExpertId}/packages_for_sale`,
    );
    const response = await fetch(
      `${API_ENDPOINT}experts/${user.marketExpertId}/packages_for_sale`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          site,
          packages: packageIds,
        }),
      },
    );

    return response;
  }

  static async updatePackageSiteForExpert(site: string) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.marketExpertId) {
      throw new Error("User is not an expert on Market.dev");
    }

    const response = await fetch(
      `${API_ENDPOINT}experts/${user.marketExpertId}/packages_for_sale/site`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          site,
        }),
      },
    );

    return response;
  }
}

export const {
  getPublishedPackagesForExpert,
  updatePublishedPackagesForExpert,
  updatePackageSiteForExpert,
} = MarketService;
