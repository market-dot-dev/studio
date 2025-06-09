"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface StripeOnboardingActionsProps {
  isConnected: boolean;
}

export function StripeOnboardingActions({ isConnected }: StripeOnboardingActionsProps) {
  const router = useRouter();

  const handleContinue = () => {
    // Store progress in session storage
    sessionStorage.setItem("onboarding-stripe-complete", "true");
    router.push("/onboarding/complete");
  };

  const handleSkip = () => {
    sessionStorage.setItem("onboarding-stripe-skipped", "true");
    router.push("/onboarding/complete");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {isConnected ? (
          <Button onClick={handleContinue} className="w-full">
            Continue
          </Button>
        ) : (
          <Button variant="secondary" onClick={handleSkip} className="w-full">
            Skip for now
          </Button>
        )}
      </div>
    </div>
  );
}
