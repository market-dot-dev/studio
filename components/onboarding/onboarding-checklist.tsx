"use client";

import { getCurrentOnboardingState } from "@/app/services/onboarding/onboarding-service";
import { OnboardingState, onboardingStepsMeta } from "@/app/services/onboarding/onboarding-steps";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, Goal, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// This component is not currently imported/used anywhere in the codebase
// It's kept here for potential future use
export default function OnboardingChecklist({
  variant = "default"
}: {
  variant?: "default" | "mini";
}) {
  const router = useRouter();
  const [onboardingState, setOnboardingState] = useState<OnboardingState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadState = async () => {
      try {
        const state = await getCurrentOnboardingState();
        setOnboardingState(state);
      } catch (error) {
        console.error("Failed to load onboarding state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadState();
  }, []);

  if (isLoading || !onboardingState || onboardingState.completed) {
    return null;
  }

  const incompleteSteps = onboardingStepsMeta.filter(
    (step) => !onboardingState[step.name].completed
  );

  if (incompleteSteps.length === 0) {
    return null;
  }

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const handleDismiss = () => {
    // Could implement dismiss functionality here if needed
    console.log("Dismiss onboarding checklist");
  };

  if (variant === "mini") {
    const nextStep = incompleteSteps[0];
    return (
      <button
        className="group flex w-full cursor-pointer items-center justify-between rounded bg-white p-1 pl-1.5 text-xs font-medium text-stone-800 shadow-border transition-colors hover:bg-stone-50"
        onClick={() => handleNavigate(nextStep.path)}
      >
        <div className="flex items-center gap-[7px]">
          <span className="size-3 shrink-0 rounded-full border border-dashed border-stone-400" />
          <span className="text-left">Next: {nextStep.title}</span>
        </div>
        <ChevronRight
          size={14}
          className="ml-0.5 inline-block transition-transform group-hover:translate-x-px"
        />
      </button>
    );
  }

  return (
    <div className="mb-6 flex w-full flex-col items-start rounded-md bg-white shadow-border-sm">
      <div className="flex w-full items-center justify-between gap-4 rounded-t-lg border-b border-stone-200/75 bg-stone-50 py-2 pl-4 pr-2.5">
        <div className="flex items-center gap-4">
          <Goal size={16} className="text-stone-500" />
          <h3 className="text-xxs font-semibold uppercase tracking-wide text-stone-500">
            Get started
          </h3>
        </div>

        <div className="m-0 flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="group -m-1 size-6 hover:bg-black/5"
          >
            <X size={16} className="!size-4 text-stone-500" />
          </Button>
        </div>
      </div>

      <div className="flex w-full flex-col overflow-hidden rounded-b-lg">
        {onboardingStepsMeta.map((step) => {
          const stepState = onboardingState[step.name];
          const isComplete = stepState.completed;

          return (
            <div key={step.name}>
              <div className="flex w-full flex-row items-center gap-4 p-4 py-2">
                <div className="flex h-5 items-center">
                  {isComplete ? (
                    <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-marketing-swamp ring-4 ring-white">
                      <Check size={12} color="white" />
                    </div>
                  ) : (
                    <div className="box-border size-4 shrink-0 rounded-full border border-dashed border-stone-400 ring-4 ring-white" />
                  )}
                </div>

                <div className="flex w-full flex-col items-start justify-between gap-x-8 lg:flex-row lg:items-center">
                  <div className="flex flex-col items-start">
                    <h5
                      className={`w-fit text-sm font-bold tracking-tightish ${
                        isComplete ? "text-stone-500" : "text-stone-800"
                      }`}
                    >
                      {step.title}
                    </h5>
                    {!isComplete && (
                      <p className="text-pretty text-sm text-stone-500">{step.description}</p>
                    )}
                  </div>

                  {!isComplete && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="group my-1.5 w-fit gap-[3px] pr-1"
                      onClick={() => handleNavigate(step.path)}
                    >
                      <span>{step.title}</span>
                      <ChevronRight
                        size={16}
                        className="inline-block transition-transform group-hover:translate-x-px"
                      />
                    </Button>
                  )}
                </div>
              </div>
              <hr className="w-full border-stone-200/75 last:hidden" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
