"use server";

import { businessDescription, businessName } from "@/lib/constants/site-template";
import prisma from "@/lib/prisma";
import { includeOrganizationOnboarding } from "@/types/onboarding";
import { getCurrentOrganizationId } from "../organization-service";
import { getCurrentUserId } from "../session-service";
import { getCurrentUser } from "../UserService";
import { defaultOnboardingState, OnboardingState } from "./onboarding-steps";

class OnboardingService {
  /**
   * Saves the onboarding state to the user record
   */
  static async saveState(state: OnboardingState) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("User not found");

    await prisma.user.update({
      where: { id: userId },
      data: {
        onboarding: JSON.stringify(state)
      }
    });
  }

  /**
   * Refreshes and returns the current onboarding state,
   * checking various organization fields to determine completion status
   */
  static async refreshAndGetState(preferredServices?: string[]) {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    const organizationId = await getCurrentOrganizationId();
    if (!organizationId) return null;

    // @TODO: This may be of better use in the Organization model
    // Get user for the onboarding JSON
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        onboarding: true
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get organization data for determining step completion
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      ...includeOrganizationOnboarding
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    let onboardingState = defaultOnboardingState;
    try {
      if (user.onboarding) {
        onboardingState = JSON.parse(user.onboarding);
      }
    } catch (error) {
      console.error("Failed to parse onboarding JSON:", error);
    }

    // Check if the business setup step is done
    if (organization.businessLocation && organization.businessType) {
      onboardingState.setupBusiness = true;
    }

    // Check if the project setup step is done
    if (
      organization.projectName !== businessName &&
      organization.projectDescription !== businessDescription
    ) {
      onboardingState.setupProject = true;
    }

    // Check if the payment setup step is done
    if (organization.stripeAccountId) {
      onboardingState.setupPayment = true;
    }

    // Check if at least one tier exists
    if (organization.tiers && organization.tiers.length > 0) {
      onboardingState.setupTiers = true;
    }

    // Check if the site setup step is done
    // The site setup is considered done if there is at least one site with more than one page,
    // or if the only page has its updatedAt date greater than createdAt date
    if (organization.sites && organization.sites.length > 0) {
      const site = organization.sites[0];
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

    await OnboardingService.saveState(onboardingState);
    return onboardingState;
  }

  /**
   * Resets the onboarding state to default
   */
  static async resetState() {
    await OnboardingService.saveState(defaultOnboardingState);
  }

  /**
   * Gets the current onboarding state from the user record
   */
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

  /**
   * Dismisses the onboarding
   */
  static async dismissOnboarding() {
    const currentOnboarding = await OnboardingService.getCurrentState();

    await OnboardingService.saveState({
      ...currentOnboarding,
      isDismissed: true
    });
  }
}

export default OnboardingService;

export const { refreshAndGetState, getCurrentState, dismissOnboarding, resetState } =
  OnboardingService;
