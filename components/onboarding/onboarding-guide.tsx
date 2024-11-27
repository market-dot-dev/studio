'use client';

import { Card, Text, Flex, Bold, Button, Divider, Icon, Badge } from "@tremor/react";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { saveState as saveOnboardingState } from "@/app/services/onboarding/OnboardingService";
import { onboardingSteps, type OnboardingStepsType, onBoardingStepType } from "@/app/services/onboarding/onboarding-steps";
import { getState } from "@/app/services/onboarding/OnboardingService";
import { useSiteId } from "../dashboard/dashboard-context";
import { Check, X, ChevronRight, Goal } from "lucide-react";
import clsx from "clsx";

function TodoItem({ step, index, currentStep, completedSteps }: {
    step: onBoardingStepType,
    index: number,
    currentStep: number | null,
    completedSteps: OnboardingStepsType,
}): JSX.Element {

    const router = useRouter()
    const siteId = useSiteId();


    const { title: stepTitle, urls: stepURL, description: stepDescription } = step;

    const activeStep = currentStep === index;

    const completed = completedSteps?.[step.name] === true;

    return (
      <>
        <div
          className={clsx(
            "flex w-full flex-row items-start gap-4 p-4 py-2.5 last:border-b-0",
          )}
        >
          <div className="flex h-5 items-center">
            {completed ? (
              <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500 ring-4 ring-stone-50">
                <Check size={12} color="white" />
              </div>
            ) : (
              <div
                className={clsx(
                  "box-border h-4 w-4 shrink-0 rounded-full border border-stone-300 ring-4 ring-stone-50",
                  activeStep ? "bg-white" : "border-dashed",
                )}
              ></div>
            )}
          </div>
          <div className="flex w-full flex-wrap items-center justify-between gap-3 ring-4 ring-stone-50">
            <div className="flex flex-col items-start">
              <Bold className="w-fit text-sm">{stepTitle}</Bold>
              {!activeStep && !completed && <Text>{stepDescription}</Text>}
            </div>
            {!activeStep && !completed && (
              <Button
                size="xs"
                variant="light"
                className="w-fit font-medium"
                onClick={() =>
                  router.push(
                    step.name === "setupSite" && siteId
                      ? stepURL[0] + siteId
                      : stepURL[0],
                  )
                }
              >
                <span>{stepTitle}</span>
                <ChevronRight size={16} className="mb-px ml-0.5 inline-block" />
              </Button>
            )}
          </div>
        </div>
        <hr className="ml-12 border-stone-200 last:hidden" />
      </>
    );
}
export default function OnboardingGuide(): JSX.Element {
    const pathName = usePathname();
    const [currentStep, setCurrentStep] = useState<number | null>(null);
    const [completedSteps, setCompletedSteps] = useState<OnboardingStepsType>(null);
    const [isDismissing, setIsDismissing] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        const action = async () => {
            const state = await getState() as OnboardingStepsType;
            setCompletedSteps(state);
        }

        action();

        let currentStep = null;
        onboardingSteps.forEach((step, index) => {
            if (step.urls.some((url) => pathName.includes(url))) {
                currentStep = index;
            }
        });

        setCurrentStep(currentStep);

        // set a window function that can be called from other components to refresh the onboarding guide
        if ((window as any)['refreshOnboarding']) return;

        (window as any)['refreshOnboarding'] = () => action();
    }, [pathName])

    const dismissGuide = useCallback(() => {
        setIsDismissing(true);
        saveOnboardingState(null).then(() => {
            setIsDismissing(false);
            setIsDismissed(true);
        });
    }, [setIsDismissing]);


    if (completedSteps === null || isDismissed || pathName === '/') return <></>;

    return (
      <div
        className={`flex max-w-screen-xl flex-col items-start overflow-hidden rounded-lg border border-stone-200 bg-stone-50 shadow-sm`}
      >
        <div className="flex w-full items-center justify-between gap-4 rounded-t-lg border-b border-stone-200/60 bg-stone-100 py-2 pl-4 pr-3">
          <div className="flex items-center gap-4">
            <Goal size={16} className="text-stone-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Get started
            </h3>
          </div>
          {!isDismissed && (
            <div className="m-0 flex justify-end">
              <Button
                variant="light"
                onClick={dismissGuide}
                className="group m-0 p-0 text-sm underline"
              >
                <X
                  size={16}
                  className="text-stone-500 transition-colors group-hover:text-stone-900"
                />
              </Button>
            </div>
          )}
        </div>
        {/* <hr className="ml-12 border-stone-200 w-full" /> */}
        <div className="before:border-dashed before:border-stone-300 relative flex w-full flex-col before:absolute before:inset-y-5 before:left-6 before:z-[-1] before:w-px before:border-l ">
          {onboardingSteps.map((step, index) => {
            return (
              <TodoItem
                key={index}
                index={index}
                step={step as onBoardingStepType}
                currentStep={currentStep}
                completedSteps={completedSteps}
              />
            );
          })}
        </div>
      </div>
    );
}
