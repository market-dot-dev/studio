"use server";

import prisma from "@/lib/prisma";
import { JsonValue } from "@prisma/client/runtime/library";
import { requireOrganization, requireUserSession } from "../user-context-service";
import {
  defaultOnboardingState,
  type OnboardingState,
  type OnboardingStepName
} from "./onboarding-steps";

/**
 * Safely parses onboarding JSON from JsonValue (JSONB field)
 */
function parseOnboardingState(jsonValue: JsonValue | null): OnboardingState {
  if (!jsonValue) return defaultOnboardingState;

  try {
    // Return if an object (Prisma auto-parses JSONB)
    if (typeof jsonValue === "object" && jsonValue !== null && !Array.isArray(jsonValue)) {
      return jsonValue as unknown as OnboardingState;
    }

    return defaultOnboardingState;
  } catch (error) {
    console.error("Failed to parse onboarding JSON:", error);
    return defaultOnboardingState;
  }
}

/**
 * Gets the current onboarding state for the organization
 */
export async function getOnboardingData() {
  const org = await requireOrganization();
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
  const { org, onboarding } = await getOnboardingData();

  // Update the specific step to completed
  onboarding[stepName] = {
    completed: true,
    completedAt: new Date().toISOString()
  };

  await prisma.organization.update({
    where: { id: org.id },
    data: { onboarding: JSON.stringify(onboarding) }
  });

  return onboarding;
}

/**
 * Checks if the current user needs to see onboarding
 */
export async function shouldShowOnboarding() {
  const { org, onboarding } = await getOnboardingData();
  const user = await requireUserSession();

  // Only show onboarding to organization owners
  if (org.ownerId !== user.id) {
    return false;
  }

  return !onboarding.completed;
}

/**
 * Completes the onboarding flow manually
 */
export async function completeOnboarding() {
  const { org, onboarding } = await getOnboardingData();

  onboarding.completed = true;
  onboarding.completedAt = new Date().toISOString();

  await prisma.organization.update({
    where: { id: org.id },
    data: { onboarding: JSON.stringify(onboarding) }
  });
}
