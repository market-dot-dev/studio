"use client";

import { Text, Bold, Button } from "@tremor/react";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { saveState as saveOnboardingState } from "@/app/services/onboarding/OnboardingService";
import {
  onboardingSteps,
  type OnboardingStepsType,
  onBoardingStepType,
} from "@/app/services/onboarding/onboarding-steps";
import { getState } from "@/app/services/onboarding/OnboardingService";
import { useSiteId } from "../dashboard/dashboard-context";
import { Check, X, ChevronRight, Goal } from "lucide-react";
import clsx from "clsx";

function TodoItem({
  step,
  completedSteps,
  isLast,
}: {
  step: onBoardingStepType;
  completedSteps: OnboardingStepsType;
  isLast: boolean;
}): JSX.Element {
  const router = useRouter();
  const siteId = useSiteId();

  const {
    title: stepTitle,
    urls: stepURL,
    description: stepDescription,
  } = step;

  const completed = completedSteps?.[step.name] === true;

  return (
    <>
      <div className={clsx("flex w-full flex-row items-center gap-4 p-4 py-2")}>
        <div className="flex h-5 items-center">
          {completed ? (
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500 ring-4 ring-white">
              <Check size={12} color="white" />
            </div>
          ) : (
            <div className="box-border h-4 w-4 shrink-0 rounded-full border border-dashed border-gray-400 ring-4 ring-white"></div>
          )}
        </div>
        <div className="flex w-full flex-wrap items-center justify-between gap-x-8 gap-y-2 lg:flex-nowrap">
          <div className="flex flex-col items-start">
            <Bold
              className={clsx(
                "w-fit text-sm",
                completed ? "text-gray-500" : "text-gray-800",
              )}
            >
              {stepTitle}
            </Bold>
            {!completed && <Text>{stepDescription}</Text>}
          </div>
          {!completed && (
            <Button
              size="xs"
              variant="secondary"
              className="group w-fit border-gray-200 bg-white py-1 pr-1.5 transition-colors"
              onClick={() =>
                router.push(
                  step.name === "setupSite" && siteId
                    ? stepURL[0] + siteId
                    : stepURL[0],
                )
              }
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

export default function OnboardingChecklist(): JSX.Element {
  const pathName = usePathname();
  const [completedSteps, setCompletedSteps] =
    useState<OnboardingStepsType>(null);
  const [isDismissing, setIsDismissing] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const action = async () => {
      const state = (await getState()) as OnboardingStepsType;
      setCompletedSteps(state);
    };

    action();

    // set a window function that can be called from other components to refresh the onboarding checklist
    if ((window as any)["refreshOnboarding"]) return;

    (window as any)["refreshOnboarding"] = () => action();
  }, [pathName]);

  const dismissChecklist = useCallback(() => {
    setIsDismissing(true);
    saveOnboardingState(null).then(() => {
      setIsDismissing(false);
      setIsDismissed(true);
    });
  }, [setIsDismissing]);

  if (completedSteps === null || isDismissed) return <></>;

  return (
    <div className="flex w-full flex-col items-start rounded-lg bg-white shadow-sm ring-1 ring-black/10">
      <div className="flex w-full items-center justify-between gap-4 rounded-t-lg border-b border-gray-200 bg-gray-50 py-2.5 pl-4 pr-2.5">
        <div className="flex items-center gap-4">
          <Goal size={16} className="text-gray-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Get started
          </h3>
        </div>
        {!isDismissed && (
          <div className="m-0 flex justify-end">
            <Button
              variant="light"
              onClick={dismissChecklist}
              className="group -m-1 rounded p-1 text-sm underline transition-colors hover:bg-gray-200"
            >
              <X size={16} className="text-gray-500" />
            </Button>
          </div>
        )}
      </div>
      <div className="flex w-full flex-col overflow-hidden rounded-b-lg">
        {onboardingSteps.map((step, index) => {
          return (
            <TodoItem
              key={index}
              step={step as onBoardingStepType}
              completedSteps={completedSteps}
              isLast={index === onboardingSteps.length - 1}
            />
          );
        })}
      </div>
    </div>
  );
}
