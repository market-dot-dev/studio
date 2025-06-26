"use client";

import { ProgressDonut } from "@/app/components/onboarding/progress-donut";
import {
  ONBOARDING_COMPLETE_PATH,
  ONBOARDING_STEP_NAMES,
  TOTAL_ONBOARDING_STEPS,
  getPreviousStepPath,
  type OnboardingStepName
} from "@/app/services/onboarding/onboarding-steps";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function OnboardingNavigation() {
  const pathname = usePathname();

  const totalSteps = TOTAL_ONBOARDING_STEPS + 1; // +1 for complete page

  const currentStepName = pathname.split("/").pop() as OnboardingStepName | "complete";
  const isCompletePage = pathname === ONBOARDING_COMPLETE_PATH;

  const stepIndex = ONBOARDING_STEP_NAMES.indexOf(currentStepName as OnboardingStepName);

  const getCurrentStepNumber = () => {
    if (isCompletePage) return totalSteps;
    if (stepIndex >= 0) return stepIndex + 1;
    return 1;
  };

  const currentStepNumber = getCurrentStepNumber();

  const previousStepPath =
    !isCompletePage &&
    currentStepName &&
    getPreviousStepPath(currentStepName as OnboardingStepName);

  return (
    <>
      {!!previousStepPath && (
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="absolute -left-2.5 md:left-0.5 md:top-0.5"
        >
          <Link href={previousStepPath}>
            <ChevronLeft className="!size-5 -translate-x-px" />
          </Link>
        </Button>
      )}

      <ProgressDonut
        currentStep={currentStepNumber}
        totalSteps={totalSteps}
        className="absolute right-0 md:right-1"
      />
    </>
  );
}
