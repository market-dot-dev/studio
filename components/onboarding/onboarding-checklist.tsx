"use client";

import { Button } from "@/components/ui/button";
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

function calculateCompletionPercentage(completedSteps: OnboardingStepsType): number {
  if (!completedSteps) return 0;
  
  const totalSteps = onboardingSteps.length;
  const completedCount = onboardingSteps.filter(step => completedSteps[step.name]).length;
  
  return totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;
}

function DonutProgress({ percentage }: { percentage: number }): JSX.Element {
  if (percentage === 0) {
    return (
      <span className="h-3 w-3 flex-shrink-0 rounded-full border border-dashed border-stone-400"></span>
    );
  }
  
  const size = 12;
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (percentage * circumference) / 100;
  
  return (
    <div className="relative h-3 w-3 flex-shrink-0">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg] text-marketing-swamp">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#E7E5E4"
          strokeWidth={strokeWidth}
          strokeDashoffset="0"
          strokeLinecap="round"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - dash}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function TodoItem({
  step,
  completedSteps,
  variant = "default",
  completionPercentage,
}: {
  step: onBoardingStepType;
  completedSteps: OnboardingStepsType;
  variant?: "default" | "mini";
  completionPercentage?: number;
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
        className="group bg-white rounded shadow-border flex w-full cursor-pointer items-center justify-between p-1 pl-1.5 text-xs font-medium text-stone-800 hover:bg-stone-50 transition-colors"
        onClick={navigateToStep}
      >
        <div className="flex items-center gap-[7px]">
          <DonutProgress percentage={completionPercentage ?? 0} />
          <span>Next: {stepTitle}</span>
        </div>
        <ChevronRight
          size={14}
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
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-marketing-swamp ring-4 ring-white">
              <Check size={12} color="white" />
            </div>
          ) : (
            <div className="box-border h-4 w-4 shrink-0 rounded-full border border-dashed border-stone-400 ring-4 ring-white"></div>
          )}
        </div>
        <div className="flex flex-col lg:flex-row w-full items-start lg:items-center justify-between gap-x-8 gap-y-1">
          <div className="flex flex-col items-start">
            <strong 
              className={clsx(
                "new-bold-tag w-fit text-sm cursor-pointer",
                completed ? "text-stone-500" : "text-stone-800 hover:text-stone-700",
              )}
              onClick={navigateToStep}
            >
              {stepTitle}
            </strong>
            {!completed && <p className="text-sm text-stone-500 text-pretty">{stepDescription}</p>}
          </div>
          {!completed && (
            <Button
              size="sm"
              variant="outline"
              className="group w-fit pr-1 gap-[3px]"
              onClick={navigateToStep}
            >
              <span>{stepTitle}</span>
              <ChevronRight
                size={16}
                className="inline-block transition-transform group-hover:translate-x-px"
              />
            </Button>
          )}
        </div>
      </div>
      <hr className=" border-stone-200 w-full last:hidden" />
    </>
  );
}

export default function OnboardingChecklist({ variant = "default" }: { variant?: "default" | "mini" }): JSX.Element {
  const pathName = usePathname();
  const [onboardingState, setOnboardingState] =
    useState<OnboardingState | null>(null);

  const [isDismissed, setIsDismissed] = useState(false);
  const isHomepage = pathName === "/";

  useEffect(() => {
    const action = async () => {
      const state = await refreshAndGetState();
      setOnboardingState(state);
    };

    action();

    if ((window as any)["refreshOnboarding"]) return;

    (window as any)["refreshOnboarding"] = () => action();
  }, [pathName]);

  useEffect(() => {
    const handleRefresh = () => {
      if ((window as any)["refreshOnboarding"]) {
        (window as any)["refreshOnboarding"]();
      }
    };

    window.addEventListener("refreshOnboarding", handleRefresh);

    return () => {
      window.removeEventListener("refreshOnboarding", handleRefresh);
    };
  }, []);

  const dismissChecklist = useCallback(() => {
    setIsDismissed(true);
    dismissOnboarding();
  }, []);

  if (onboardingState?.isDismissed || isDismissed) return <></>;

  if (variant === "mini") {
    if (isHomepage) return <></>;
    const nextStep = onboardingSteps.find(
      (step) => !onboardingState?.[step.name]
    );
    
    if (!nextStep || !onboardingState) return <></>;
    
    const completionPercentage = calculateCompletionPercentage(onboardingState);
    
    return <TodoItem 
      step={nextStep} 
      completedSteps={onboardingState} 
      variant="mini" 
      completionPercentage={completionPercentage}
    />;
  }

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
            variant="ghost"
            size="icon"
            onClick={dismissChecklist}
            className="group -m-1 hover:bg-black/5 h-6 w-6"
          >
            <X size={16} className="!size-4 text-stone-500" />
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
