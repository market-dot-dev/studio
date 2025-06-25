"use server";

import prisma from "@/lib/prisma";
import { JsonValue } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import { requireUserSession } from "../user-context-service";
import {
  defaultOnboardingState,
  ONBOARDING_STEPS,
  OnboardingState,
  OnboardingStepName
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

    // Parse if it's a string (legacy data)
    if (typeof jsonValue === "string") {
      return JSON.parse(jsonValue) as OnboardingState;
    }

    return defaultOnboardingState;
  } catch (error) {
    console.error("Failed to parse onboarding JSON:", error);
    return defaultOnboardingState;
  }
}

/**
 * Gets the current organization with onboarding field
 */
async function getOrganizationWithOnboarding() {
  const user = await requireUserSession();

  if (!user.currentOrgId) {
    throw new Error("No current organization");
  }

  const org = await prisma.organization.findUnique({
    where: { id: user.currentOrgId },
    select: {
      id: true,
      onboarding: true,
      ownerId: true
    }
  });

  if (!org) {
    throw new Error("Organization not found");
  }

  return org;
}

/**
 * Gets the current onboarding state for the organization
 */
export async function getCurrentOnboardingState(): Promise<OnboardingState> {
  const org = await getOrganizationWithOnboarding();
  return parseOnboardingState(org.onboarding);
}

/**
 * Marks a specific step as completed in the onboarding flow
 */
export async function completeOnboardingStep(
  stepName: OnboardingStepName
): Promise<OnboardingState> {
  const org = await getOrganizationWithOnboarding();
  const currentState = parseOnboardingState(org.onboarding);

  currentState[stepName] = {
    completed: true,
    completedAt: new Date().toISOString()
  };

  await prisma.organization.update({
    where: { id: org.id },
    data: { onboarding: JSON.stringify(currentState) }
  });

  return currentState;
}

/**
 * Checks if the current user needs to see onboarding
 */
export async function shouldShowOnboarding(): Promise<boolean> {
  try {
    const user = await requireUserSession();

    if (!user.currentOrgId) {
      return false;
    }

    const org = await getOrganizationWithOnboarding();

    // Only show onboarding to organization owners
    if (org.ownerId !== user.id) {
      return false;
    }

    const state = parseOnboardingState(org.onboarding);
    return !state.completed;
  } catch {
    return false;
  }
}

/**
 * Gets the next incomplete step in the onboarding flow
 */
export async function getNextOnboardingStep(): Promise<string | null> {
  const state = await getCurrentOnboardingState();

  // Find the first step that hasn't been completed
  const stepOrder: OnboardingStepName[] = [
    ONBOARDING_STEPS.ORGANIZATION,
    ONBOARDING_STEPS.TEAM,
    ONBOARDING_STEPS.STRIPE,
    ONBOARDING_STEPS.PRICING
  ];

  for (const stepName of stepOrder) {
    if (!state[stepName].completed) {
      return `/onboarding/${stepName}`;
    }
  }

  return null;
}

/**
 * Completes the onboarding flow manually
 */
export async function completeOnboarding(): Promise<void> {
  const org = await getOrganizationWithOnboarding();
  const currentState = parseOnboardingState(org.onboarding);

  currentState.completed = true;
  currentState.completedAt = new Date().toISOString();

  await prisma.organization.update({
    where: { id: org.id },
    data: { onboarding: JSON.stringify(currentState) }
  });
}

/**
 * Resets the onboarding state (mainly for testing)
 */
export async function resetOnboarding(): Promise<void> {
  const org = await getOrganizationWithOnboarding();

  await prisma.organization.update({
    where: { id: org.id },
    data: { onboarding: JSON.stringify(defaultOnboardingState) }
  });

  revalidatePath("/onboarding", "layout");
}
