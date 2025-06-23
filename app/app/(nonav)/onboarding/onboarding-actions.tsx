"use client";

import { completeOnboardingStep } from "@/app/services/onboarding/onboarding-service";
import { OnboardingStepName } from "@/app/services/onboarding/onboarding-steps";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface OnboardingActionsProps {
  currentStep: OnboardingStepName;
  nextPath: string | null;
  canContinue?: boolean;
  continueLabel?: string;
  beforeAction?: () => Promise<void> | void;
}

export function OnboardingActions({
  currentStep,
  nextPath,
  canContinue = true,
  continueLabel = "Continue",
  beforeAction
}: OnboardingActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    setIsLoading(true);

    try {
      if (beforeAction) {
        await beforeAction();
      }

      await completeOnboardingStep(currentStep);

      if (nextPath) {
        router.push(nextPath);
      } else {
        router.push("/"); // If no next path, go to dashboard
      }
    } catch (error) {
      console.error("Failed to complete onboarding step:", error);
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="lg"
      onClick={() => startTransition(() => handleContinue())}
      disabled={!canContinue || isPending || isLoading}
      loading={isLoading}
      className="w-full"
    >
      {continueLabel}
    </Button>
  );
}
