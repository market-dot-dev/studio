"use client";

import { ProgressDonut } from "@/app/components/onboarding/progress-donut";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Define the onboarding steps and their navigation
const ONBOARDING_STEPS = {
  "/onboarding/organization": {
    step: 1,
    isFirst: true,
    previous: null
  },
  "/onboarding/business-description": {
    step: 2,
    isFirst: false,
    previous: "/onboarding/organization"
  },
  "/onboarding/generate-tiers": {
    step: 3,
    isFirst: false,
    previous: "/onboarding/business-description"
  },
  "/onboarding/stripe": {
    step: 4,
    isFirst: false,
    previous: "/onboarding/generate-tiers"
  },
  "/onboarding/team": {
    step: 5,
    isFirst: false,
    previous: "/onboarding/stripe"
  },
  "/onboarding/pricing": {
    step: 6,
    isFirst: false,
    previous: "/onboarding/team"
  },
  "/onboarding/complete": {
    step: 7,
    isFirst: false,
    previous: "/onboarding/pricing"
  }
} as const;

export function OnboardingNavigation() {
  const pathname = usePathname();

  // Get step info, defaulting to step 1 if not found
  const currentStep = ONBOARDING_STEPS[pathname as keyof typeof ONBOARDING_STEPS] || {
    step: 1,
    isFirst: true,
    previous: null
  };

  const showBackButton = currentStep && !currentStep.isFirst;

  return (
    <>
      {showBackButton && currentStep.previous && (
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="absolute -left-2.5 md:left-0.5 md:top-0.5"
        >
          <Link href={currentStep.previous}>
            <ChevronLeft className="!size-5 -translate-x-px" />
          </Link>
        </Button>
      )}

      <ProgressDonut
        currentStep={currentStep?.step || 1}
        totalSteps={7}
        className="absolute right-0 md:right-1"
      />
    </>
  );
}
