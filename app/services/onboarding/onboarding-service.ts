"use server";

import prisma from "@/lib/prisma";
import { JsonValue } from "@prisma/client/runtime/library";
import { requireUserSession } from "../user-context-service";
import {
  defaultOnboardingState,
  ONBOARDING_STEPS,
  OnboardingState,
  OnboardingStepName
} from "./onboarding-steps";

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
 * Safely parses onboarding JSON from JsonValue (JSONB field)
 */
function parseOnboardingState(jsonValue: JsonValue | null): OnboardingState {
  if (!jsonValue) return defaultOnboardingState;

  try {
    // Return if an object (Prisma auto-parses JSONB)
    if (typeof jsonValue === "object" && jsonValue !== null && !Array.isArray(jsonValue)) {
      return jsonValue as unknown as OnboardingState;
    }

    // Parse if it's a string (legacy)
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
 * Gets the current onboarding state for the organization
 */
export async function getOnboardingData() {
  const org = await getOrganizationWithOnboarding();
  const onboarding = parseOnboardingState(org.onboarding);

  return {
    org: { id: org.id, ownerId: org.ownerId },
    onboarding
  };
}

/**
 * Marks a specific step as completed in the onboarding flow
 */
export async function completeOnboardingStep(stepName: OnboardingStepName) {
  const { org, onboarding } = await getOnboardingData();

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
  try {
    const user = await requireUserSession();

    if (!user.currentOrgId) {
      return false;
    }

    const { org, onboarding } = await getOnboardingData();

    // Only show onboarding to organization owners
    if (org.ownerId !== user.id) {
      return false;
    }

    return !onboarding.completed;
  } catch {
    return false;
  }
}

/**
 * Gets the next incomplete step in the onboarding flow
 */
export async function getNextOnboardingStep() {
  const { onboarding } = await getOnboardingData();

  const stepOrder: OnboardingStepName[] = [
    ONBOARDING_STEPS.ORGANIZATION,
    ONBOARDING_STEPS.TEAM,
    ONBOARDING_STEPS.STRIPE,
    ONBOARDING_STEPS.PRICING
  ];

  // Find the first step that hasn't been completed
  for (const stepName of stepOrder) {
    if (!onboarding[stepName].completed) {
      return `/onboarding/${stepName}`;
    }
  }

  return null;
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
