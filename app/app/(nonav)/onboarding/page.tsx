import { getStepMeta, ONBOARDING_STEPS } from "@/app/services/onboarding/onboarding-steps";
import { redirect } from "next/navigation";

export default function OnboardingPage() {
  // Redirect to the first step of onboarding - organization setup
  const stepMeta = getStepMeta(ONBOARDING_STEPS.ORGANIZATION);

  redirect(stepMeta?.path || "/onboarding/organization");
}
