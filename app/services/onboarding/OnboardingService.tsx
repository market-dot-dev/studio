"use server";
// also write a little guide for the user to follow in order to create new steps
// like writing to db schema etc

import prisma from "@/lib/prisma";
import { getCurrentUserId } from "../SessionService";
import { defaultOnboardingState, OnboardingState } from "./onboarding-steps";
import {
  businessName,
  businessDescription,
} from "@/lib/constants/site-template";
import { getCurrentUser } from "../UserService";
import { MarketService } from "../market-service";

class OnboardingService {
  static async saveState(state: OnboardingState) {
    const id = await getCurrentUserId();
    if (!id) throw new Error("User not found");

    await prisma?.user.update({
      where: {
        id,
      },
      data: {
        onboarding: JSON.stringify(state),
      },
    });
  }

  static async refreshAndGetState(preferredServices?: string[]) {
    const id = await getCurrentUserId();
    if (!id) return null;

    const result = await prisma?.user.findUnique({
      where: {
        id,
      },
      select: {
        onboarding: true,
        projectName: true,
        projectDescription: true,
        businessLocation: true,
        businessType: true,
        stripeAccountId: true,
        createdAt: true,
        marketExpertId: true,
        // select first site
        sites: {
          select: {
            id: true,
            pages: {
              select: {
                id: true,
                createdAt: true,
                updatedAt: true,
              },
              orderBy: {
                createdAt: "asc",
              },
              take: 2,
            },
          },
          orderBy: {
            createdAt: "asc",
          },
          take: 1,
        },
        tiers: {
          select: {
            id: true,
          },
          orderBy: {
            createdAt: "asc",
          },
          take: 1,
        },
        repos: {
          select: {
            id: true,
          },
          orderBy: {
            createdAt: "asc",
          },
          take: 1,
        },
      },
    });

    if (!result) {
      throw new Error("User not found");
    }

    let onboardingState = defaultOnboardingState;
    try {
      if (result.onboarding) {
        onboardingState = JSON.parse(result.onboarding);
      }
    } catch (error) {
      console.error("Failed to parse onboarding JSON:", error);
    }

    // Check if the project setup step is done
    if (result.businessLocation && result.businessType) {
      onboardingState.setupBusiness = true;
    }

    if (
      result.projectName !== businessName &&
      result.projectDescription !== businessDescription
    ) {
      onboardingState.setupProject = true;
    }

    // Check if the payment setup step is done
    if (result.stripeAccountId) {
      onboardingState.setupPayment = true;
    }

    // Check if at least one tier exists
    if (result.tiers && result.tiers.length > 0) {
      onboardingState.setupTiers = true;
    }

    // Check if at least one repo is connected
    if (result.repos && result.repos.length > 0) {
      onboardingState.connectRepos = true;
    }

    // Check if the site setup step is done
    // The site setup is considered done if there is at least one site with more than one page,
    // or if the only page has its updatedAt date greater than createdAt date
    if (result.sites && result.sites.length > 0) {
      const site = result.sites[0];
      if (site.pages.length > 1) {
        onboardingState.setupSite = true;
      } else if (
        site.pages.length === 1 &&
        new Date(site.pages[0].updatedAt) > new Date(site.pages[0].createdAt)
      ) {
        onboardingState.setupSite = true;
      }
    }

    if (preferredServices) {
      onboardingState.preferredServices = preferredServices;
    }

    try {
      const response = await MarketService.validateAccount();
      const responseData = await response.json();
      if (
        response.status === 200 &&
        responseData.linked &&
        responseData.expert &&
        result.marketExpertId === responseData.expert.id.toString()
      ) {
        onboardingState.marketDevAccountConnected = true;
      }
    } catch (error) {
      console.error("Failed to validate Market.dev account:", error);
    }

    await OnboardingService.saveState(onboardingState);
    return onboardingState;
  }

  static async resetState() {
    await OnboardingService.saveState(defaultOnboardingState);
  }

  static async getCurrentState() {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not found");

    if (user.onboarding) {
      try {
        return JSON.parse(user.onboarding);
      } catch (error) {
        console.error("Failed to parse onboarding JSON:", error);
      }
    }

    return defaultOnboardingState;
  }

  static async dismissOnboarding() {
    const currentOnboarding = await OnboardingService.getCurrentState();

    await OnboardingService.saveState({
      ...currentOnboarding,
      isDismissed: true,
    });
  }
}

export default OnboardingService;

export const {
  refreshAndGetState,
  getCurrentState,
  dismissOnboarding,
  resetState,
} = OnboardingService;
