"use client";

import { completeOnboardingStep } from "@/app/services/onboarding/onboarding-service";
import { OnboardingStepName } from "@/app/services/onboarding/onboarding-steps";
import { Button, ButtonProps } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface OnboardingActionProps {
  currentStep: OnboardingStepName;
  nextPath: string | null;
  continueLabel?: string;
  variant?: ButtonProps["variant"];
  beforeAction?: () => Promise<void> | void;
}

export function OnboardingAction({
  currentStep,
  nextPath,
  variant = "default",
  continueLabel = "Continue",
  beforeAction
}: OnboardingActionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleContinue = async () => {
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
    }
  };

  return (
    <Button
      variant={variant}
      onClick={() => startTransition(() => handleContinue())}
      loading={isPending}
      className="w-full"
    >
      {continueLabel}
    </Button>
  );
}
