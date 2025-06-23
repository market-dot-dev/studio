"use client";

import { ProgressDonut } from "@/app/components/onboarding/progress-donut";
import { onboardingStepsMeta } from "@/app/services/onboarding/onboarding-steps";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function OnboardingNavigation() {
  const pathname = usePathname();

  // Find the current step based on pathname
  const currentStepMeta = onboardingStepsMeta.find((step) => step.path === pathname);

  // Also check for the complete page
  const isCompletePage = pathname === "/onboarding/complete";
  const currentStepNumber = currentStepMeta
    ? onboardingStepsMeta.indexOf(currentStepMeta) + 1
    : isCompletePage
      ? onboardingStepsMeta.length + 1
      : 1;

  const totalSteps = onboardingStepsMeta.length + 1; // +1 for complete page
  const showBackButton = currentStepMeta && currentStepMeta.previousPath;

  return (
    <>
      {showBackButton && currentStepMeta?.previousPath && (
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="absolute -left-2.5 md:left-0.5 md:top-0.5"
        >
          <Link href={currentStepMeta.previousPath}>
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
