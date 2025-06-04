"use server";

import { businessDescription } from "@/lib/constants/site-template";
import prisma from "@/lib/prisma";
import { includeOrganizationOnboarding, OrganizationOnboardingData } from "@/types/onboarding";
import { requireUser, requireUserSession } from "../user-context-service";
import { defaultOnboardingState, OnboardingState } from "./onboarding-steps";

/**
 * Safely parses onboarding JSON from string
 */
function parseOnboardingState(jsonString: string | null): OnboardingState {
  if (!jsonString) return defaultOnboardingState;

  try {
    return JSON.parse(jsonString) as OnboardingState;
  } catch (error) {
    console.error("Failed to parse onboarding JSON:", error);
    return defaultOnboardingState;
  }
}

/**
 * Saves the onboarding state to the user record
 */
export async function saveState(state: OnboardingState): Promise<void> {
  const user = await requireUserSession();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      onboarding: JSON.stringify(state)
    }
  });
}

/**
 * Validates if business setup is complete
 */
function isBusinessSetupComplete(organization: OrganizationOnboardingData): boolean {
  return !!(organization.businessLocation && organization.businessType);
}

/**
 * Validates if project setup is complete
 */
function isProjectSetupComplete(organization: OrganizationOnboardingData): boolean {
  return organization.businessDescription !== businessDescription;
}

/**
 * Validates if site setup is complete
 */
function isSiteSetupComplete(organization: OrganizationOnboardingData): boolean {
  if (!organization.sites?.length) return false;

  const site = organization.sites[0];
  if (site.pages.length > 1) return true;

  return (
    site.pages.length === 1 && new Date(site.pages[0].updatedAt) > new Date(site.pages[0].createdAt)
  );
}

/**
 * Refreshes and returns the current onboarding state,
 * checking various organization fields to determine completion status
 */
export async function refreshAndGetState(preferredServices?: string[]): Promise<OnboardingState> {
  const user = await requireUserSession();

  // Get user for the onboarding JSON
  const updated = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      currentOrganizationId: true,
      onboarding: true
    }
  });

  if (!updated?.currentOrganizationId) {
    throw new Error("User or organization ID not found");
  }

  // Get organization data for determining step completion
  const organization = await prisma.organization.findUnique({
    where: { id: updated.currentOrganizationId },
    ...includeOrganizationOnboarding
  });

  if (!organization) {
    throw new Error("Organization not found");
  }

  // Parse current onboarding state
  const onboardingState = parseOnboardingState(updated.onboarding);

  // Update completion statuses
  const updatedState = {
    ...onboardingState,
    setupBusiness: isBusinessSetupComplete(organization),
    setupProject: isProjectSetupComplete(organization),
    setupPayment: !!organization.stripeAccountId,
    setupTiers: !!(organization.tiers && organization.tiers.length > 0),
    setupSite: isSiteSetupComplete(organization),
    ...(preferredServices ? { preferredServices } : {})
  };

  await saveState(updatedState);
  return updatedState;
}

/**
 * Resets the onboarding state to default
 */
export async function resetState(): Promise<void> {
  await saveState(defaultOnboardingState);
}

/**
 * Gets the current onboarding state from the user record
 */
export async function getCurrentState(): Promise<OnboardingState> {
  const user = await requireUser();
  return parseOnboardingState(user.onboarding);
}

/**
 * Dismisses the onboarding
 */
export async function dismissOnboarding(): Promise<void> {
  const currentOnboarding = await getCurrentState();
  await saveState({
    ...currentOnboarding,
    isDismissed: true
  });
}
