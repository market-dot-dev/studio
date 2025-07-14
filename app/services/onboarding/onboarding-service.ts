"use server";

import prisma from "@/lib/prisma";
import { requireUserSession } from "../user-context-service";
import {
  defaultOnboardingState,
  type OnboardingState,
  type OnboardingStepName
} from "./onboarding-steps";

/**
 * Safely parses onboarding state from Prisma Json field
 * Prisma automatically parses JSONB, so we just need type checking
 */
function parseOnboardingState(jsonValue: unknown): OnboardingState {
  // Handle null/undefined
  if (!jsonValue) return defaultOnboardingState;

  // Validate it's an object with the expected structure
  if (typeof jsonValue === "object" && jsonValue !== null && !Array.isArray(jsonValue)) {
    return jsonValue as OnboardingState;
  }

  console.error("Invalid onboarding state format:", jsonValue);
  return defaultOnboardingState;
}

/**
 * Gets the current onboarding state for the organization
 */
export async function getOnboardingData() {
  const { getCurrentOrganization } = await import("../user-context-service");
  const org = await getCurrentOrganization();

  if (!org) {
    return null;
  }

  const onboarding = parseOnboardingState(org.onboarding);

  return {
    org: { id: org.id, ownerId: org.owner.id },
    onboarding
  };
}

/**
 * Marks a specific step as completed in the onboarding flow
 */
export async function completeOnboardingStep(stepName: OnboardingStepName) {
  const data = await getOnboardingData();

  if (!data) {
    throw new Error("Cannot complete onboarding step: No organization found");
  }

  const { org, onboarding } = data;

  // Update the specific step to completed
  const updatedOnboarding: OnboardingState = {
    ...onboarding,
    [stepName]: {
      completed: true,
      completedAt: new Date().toISOString()
    }
  };

  // Pass the object directly - Prisma handles JSON serialization
  await prisma.organization.update({
    where: { id: org.id },
    data: { onboarding: updatedOnboarding }
  });

  return updatedOnboarding;
}

/**
 * Checks if org has been onboarded (for owners)
 * Returns false if no organization exists
 */
export async function isOrgOnboarded() {
  const data = await getOnboardingData();

  if (!data) {
    // No organization exists
    return false;
  }

  const { org, onboarding } = data;
  const user = await requireUserSession();

  // Only show onboarding to organization owners
  if (org.ownerId !== user.id) {
    return true;
  }

  return onboarding.completed;
}

/**
 * Completes the onboarding flow manually
 */
export async function completeOnboarding() {
  const data = await getOnboardingData();

  if (!data) {
    throw new Error("Cannot complete onboarding: No organization found");
  }

  const { org, onboarding } = data;

  const updatedOnboarding: OnboardingState = {
    ...onboarding,
    completed: true,
    completedAt: new Date().toISOString()
  };

  // Pass the object directly - no JSON.stringify needed
  await prisma.organization.update({
    where: { id: org.id },
    data: { onboarding: updatedOnboarding }
  });

  return updatedOnboarding;
}
