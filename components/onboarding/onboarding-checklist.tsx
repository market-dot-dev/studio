"use client";

import { Text, Bold, Button } from "@tremor/react";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { dismissOnboarding } from "@/app/services/onboarding/OnboardingService";
import {
  onboardingSteps,
  type OnboardingStepsType,
  onBoardingStepType,
  OnboardingState,
} from "@/app/services/onboarding/onboarding-steps";
import { refreshAndGetState } from "@/app/services/onboarding/OnboardingService";
import { useSiteId } from "../dashboard/dashboard-context";
import { Check, X, ChevronRight, Goal } from "lucide-react";
import clsx from "clsx";

function TodoItem({
  step,
  completedSteps,
  variant = "default",
}: {
  step: onBoardingStepType;
  completedSteps: OnboardingStepsType;
  variant?: "default" | "mini";
}): JSX.Element {
  const router = useRouter();
  const siteId = useSiteId();

  const {
    title: stepTitle,
    urls: stepURL,
    description: stepDescription,
  } = step;

  const completed = completedSteps?.[step.name] === true;
  
  const navigateToStep = () => {
    router.push(
      step.name === "setupSite" && siteId
        ? stepURL[0] + siteId
        : stepURL[0],
    );
  };

  if (variant === "mini") {
    return (
      <div
        className="group bg-white rounded shadow-border flex w-full cursor-pointer items-center justify-between pl-2 pr-0.5 py-1 text-xs font-medium text-stone-900 hover:bg-stone-50 transition-colors"
        onClick={navigateToStep}
      >
        <span>Next: {stepTitle}</span>
        <ChevronRight
          size={16}
          className="ml-0.5 inline-block transition-transform group-hover:translate-x-px"
        />
      </div>
    );
  }

  return (
    <>
      <div className={clsx("flex w-full flex-row items-center gap-4 p-4 py-2")}>
        <div className="flex h-5 items-center">
          {completed ? (
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500 ring-4 ring-white">
              <Check size={12} color="white" />
            </div>
          ) : (
            <div className="box-border h-4 w-4 shrink-0 rounded-full border border-dashed border-stone-400 ring-4 ring-white"></div>
          )}
        </div>
        <div className="flex w-full flex-wrap items-center justify-between gap-x-8 gap-y-2 lg:flex-nowrap">
          <div className="flex flex-col items-start">
            <Bold
              className={clsx(
                "w-fit text-sm cursor-pointer",
                completed ? "text-stone-500" : "text-stone-800 hover:text-stone-600",
              )}
              onClick={navigateToStep}
            >
              {stepTitle}
            </Bold>
            {!completed && <Text>{stepDescription}</Text>}
          </div>
          {!completed && (
            <Button
              size="xs"
              variant="secondary"
              className="group w-fit border-stone-200 bg-white py-1 pr-1.5 transition-colors"
              onClick={navigateToStep}
            >
              <span>{stepTitle}</span>
              <ChevronRight
                size={16}
                className="mb-0.5 ml-0.5 inline-block transition-transform group-hover:translate-x-px"
              />
            </Button>
          )}
        </div>
      </div>
      <hr className="w-full last:hidden" />
    </>
  );
}

export default function OnboardingChecklist({ variant = "default" }: { variant?: "default" | "mini" }): JSX.Element {
  const pathName = usePathname();
  const [onboardingState, setOnboardingState] =
    useState<OnboardingState | null>(null);

  // default to true, so that a blip of the checklist is not shown if the user has completed any steps
  const [isDismissed, setIsDismissed] = useState(false);
  const isHomepage = pathName === "/";

  useEffect(() => {
    const action = async () => {
      const state = await refreshAndGetState();
      setOnboardingState(state);
    };

    action();

    // set a window function that can be called from other components to refresh the onboarding checklist
    if ((window as any)["refreshOnboarding"]) return;

    (window as any)["refreshOnboarding"] = () => action();
  }, [pathName]);

  const dismissChecklist = useCallback(() => {
    setIsDismissed(true);
    dismissOnboarding();
  }, []);

  if (onboardingState?.isDismissed || isDismissed) return <></>;

  // For mini variant, only show if we're not on homepage
  if (variant === "mini") {
    if (isHomepage) return <></>;
    // Find the first incomplete step for mini variant
    const nextStep = onboardingSteps.find(
      (step) => !onboardingState?.[step.name]
    );
    if (!nextStep || !onboardingState) return <></>;
    return <TodoItem step={nextStep} completedSteps={onboardingState} variant="mini" />;
  }

  // For default variant, only show if we are on homepage
  if (!isHomepage) return <></>;

  return (
    <div className="mb-6 flex w-full flex-col items-start rounded-lg bg-white shadow-border">
      <div className="flex w-full items-center justify-between gap-4 rounded-t-lg border-b border-stone-200 bg-stone-50 py-2.5 pl-4 pr-2.5">
        <div className="flex items-center gap-4">
          <Goal size={16} className="text-stone-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Get started
          </h3>
        </div>

        <div className="m-0 flex justify-end">
          <Button
            variant="light"
            onClick={dismissChecklist}
            className="group -m-1 rounded p-1 text-sm underline transition-colors hover:bg-black/5"
          >
            <X size={16} className="text-stone-500" />
          </Button>
        </div>
      </div>
      <div className="flex w-full flex-col overflow-hidden rounded-b-lg">
        {onboardingSteps.map((step, index) => {
          return (
            <TodoItem
              key={index}
              step={step as onBoardingStepType}
              completedSteps={onboardingState}
              variant="default"
            />
          );
        })}
      </div>
    </div>
  );
}
