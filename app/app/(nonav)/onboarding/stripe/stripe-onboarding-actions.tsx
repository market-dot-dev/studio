"use client";

import { completeOnboardingStep } from "@/app/services/onboarding/onboarding-service";
import { ONBOARDING_STEPS } from "@/app/services/onboarding/onboarding-steps";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface StripeOnboardingActionsProps {
  isConnected: boolean;
  nextPath: string;
}

export function StripeOnboardingActions({ isConnected, nextPath }: StripeOnboardingActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleContinue = () => {
    startTransition(async () => {
      try {
        await completeOnboardingStep(ONBOARDING_STEPS.STRIPE);
        router.push(nextPath);
      } catch (error) {
        console.error("Failed to complete onboarding:", error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <Button onClick={handleContinue} className="w-full" disabled={isPending}>
        {isConnected ? "Continue" : "Skip for now"}
      </Button>
    </div>
  );
}
