"use server";

import { businessDescription, businessName } from "@/lib/constants/site-template";
import prisma from "@/lib/prisma";
import { includeOrganizationOnboarding } from "@/types/onboarding";
import { requireUser, requireUserSession } from "../user-context-service";
import { defaultOnboardingState, OnboardingState } from "./onboarding-steps";

class OnboardingService {
  /**
   * Saves the onboarding state to the user record
   */
  static async saveState(state: OnboardingState) {
    const user = await requireUserSession();
    await prisma.user.update({
      where: { id: user.id },
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
    const user = await requireUserSession();

    // @TODO: This may be of better use in the Organization model
    // Get user for the onboarding JSON
    const updated = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        currentOrganizationId: true,
        onboarding: true
      }
    });

    if (!updated || !updated.currentOrganizationId) {
      throw new Error("User not found");
    }

    // Get organization data for determining step completion
    const organization = await prisma.organization.findUnique({
      where: { id: updated.currentOrganizationId },
      ...includeOrganizationOnboarding
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    let onboardingState = defaultOnboardingState;
    try {
      if (updated.onboarding) {
        onboardingState = JSON.parse(updated.onboarding);
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
    const user = await requireUser();
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
