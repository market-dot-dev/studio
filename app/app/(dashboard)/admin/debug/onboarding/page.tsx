"use client";

import { Card, Title, Button, Badge } from "@tremor/react";
import { useCallback, useState } from "react";
import { saveState as saveOnboardingState } from "@/app/services/onboarding/OnboardingService";
import { defaultOnboardingState } from "@/app/services/onboarding/onboarding-steps";

export default function RestoreOnboarding(): JSX.Element {
  const [completedSteps, setCompletedSteps] = useState(null);
  const [isDismissing, setIsDismissing] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const dismissGuide = useCallback(() => {
    setIsDismissing(true);
    saveOnboardingState(null).then(() => {
      setIsDismissing(false);
      setIsDismissed(true);
    });
  }, [setIsDismissing]);

  return (
    <div className="w-1/2">
      <Card className="border-2 border-slate-800 bg-slate-50">
        <Badge size="xs" className="mb-1.5 me-2">
          FOR DEBUGGING PURPOSES ONLY
        </Badge>
        <Title>Restore Onboarding Guide</Title>
        <Button
          loading={isDismissing}
          onClick={() => {
            setIsDismissing(true);
            saveOnboardingState(defaultOnboardingState).then(() => {
              const newState = { ...defaultOnboardingState };
              setCompletedSteps((prev: any) => {
                return {
                  ...prev,
                  ...newState,
                };
              });
              setIsDismissing(false);
              setIsDismissed(false);
            });
          }}
        >
          Restore
        </Button>
      </Card>
    </div>
  );
}
