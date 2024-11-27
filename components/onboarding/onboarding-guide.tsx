'use client';

import { Card, Text, Flex, Bold, Button, Divider, Icon, Badge } from "@tremor/react";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { saveState as saveOnboardingState } from "@/app/services/onboarding/OnboardingService";
import { onboardingSteps, type OnboardingStepsType, onBoardingStepType } from "@/app/services/onboarding/onboarding-steps";
import { getState } from "@/app/services/onboarding/OnboardingService";
import { useSiteId } from "../dashboard/dashboard-context";
import { Check, X, ChevronRight } from "lucide-react";

function TodoItem({ step, index, currentStep, completedSteps, setCompletedSteps }: {
    step: onBoardingStepType,
    index: number,
    currentStep: number | null,
    completedSteps: OnboardingStepsType,
    setCompletedSteps: (steps: OnboardingStepsType) => void,
}): JSX.Element {

    const router = useRouter()
    const siteId = useSiteId();


    const { title: stepTitle, urls: stepURL, description: stepDescription, icon: stepIcon } = step;

    const activeStep = currentStep === index;

    const completed = completedSteps?.[step.name] === true;

    return (
      <>
        <div
          className="flex w-full flex-row items-start gap-4 border-b p-4 py-3 last:border-b-0"
          onClick={() =>
            router.push(
              step.name === "setupSite" && siteId
                ? stepURL[0] + siteId
                : stepURL[0],
            )
          }
        >
          {completed ? (
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500">
              <Check size={16} color="white" />
            </div>
          ) : activeStep ? (
            <div className="box-border h-5 w-5 shrink-0 rounded-full border-2"></div>
          ) : (
            <div className="box-border h-5 w-5 shrink-0 rounded-full border-2 border-dashed"></div>
          )}
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
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
        if (!(window as any)['refreshOnboarding']) {
            (window as any)['refreshOnboarding'] = () => {
                action();
            }
        }
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
        className={`flex max-w-screen-xl flex-col items-start rounded-lg shadow-sm ring-1 ring-black/10`}
      >
        <div className="flex w-full items-center justify-between gap-4 px-4 py-2 border-b bg-gray-50">
            <h3 className="font-bold text-sm">Get started</h3>
            {!isDismissed && (
                <div className="m-0 flex justify-end">
                <Button
                    variant="light"
                    onClick={dismissGuide}
                    className="m-0 p-0 text-sm underline group"
                >
                    <X size={20} className="text-gray-500 group-hover:text-gray-900 transition-colors" />
                </Button>
                </div>
            )}
        </div>
        <div className="flex w-full flex-col">
          {onboardingSteps.map((step, index) => {
            return (
              <TodoItem
                key={index}
                index={index}
                step={step as onBoardingStepType}
                currentStep={currentStep}
                completedSteps={completedSteps}
                setCompletedSteps={setCompletedSteps}
              />
            );
          })}
        </div>
      </div>
    );
}
