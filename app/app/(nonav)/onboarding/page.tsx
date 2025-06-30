import { ONBOARDING_STEPS, OnboardingStepName } from "@/app/services/onboarding/onboarding-steps";
import { redirect } from "next/navigation";

export default function OnboardingPage() {
  // Redirect to the first step of onboarding
  const firstStepName = Object.keys(ONBOARDING_STEPS)[0] as OnboardingStepName;
  const firstStep = ONBOARDING_STEPS[firstStepName];

  redirect(firstStep.path);
}
