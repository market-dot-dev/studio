"use client";

import {
  Card,
  Text,
  Flex,
  Bold,
  Button,
  Divider,
  Icon,
  Badge,
} from "@tremor/react";
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
import { Check, BadgeAlert } from "lucide-react";

function TodoItem({
  step,
  index,
  currentStep,
  completedSteps,
  dashboard,
}: {
  step: onBoardingStepType;
  index: number;
  currentStep: number | null;
  completedSteps: OnboardingStepsType;
  setCompletedSteps: (steps: OnboardingStepsType) => void;
  dashboard?: boolean;
}): JSX.Element {
  const router = useRouter();
  const siteId = useSiteId();

  const {
    title: stepTitle,
    urls: stepURL,
    description: stepDescription,
    icon: stepIcon,
  } = step;

  const stepIconDiv = (
    <div className="me-2">
      <Icon icon={stepIcon} size={"xl"} />
    </div>
  );

  const activeStep = currentStep === index;

  const completed = completedSteps?.[step.name] === true;

  return (
    <>
      <div
        className="flex cursor-pointer"
        onClick={() =>
          router.push(
            step.name === "setupSite" && siteId
              ? stepURL[0] + siteId
              : stepURL[0],
          )
        }
      >
        <div className="flex flex-row">
          {dashboard && stepIconDiv}
          <div
            className={
              !dashboard && activeStep
                ? `mx-2 mb-2 w-full rounded-lg bg-gray-100 p-2`
                : !dashboard
                  ? `mb-2 w-full p-2`
                  : ``
            }
          >
            <div className="mb-2 px-1">
              <div
                className={
                  dashboard
                    ? "flex items-center justify-start gap-0"
                    : "flex flex-col items-center justify-start gap-0"
                }
              >
                <Badge
                  icon={completed ? Check : BadgeAlert}
                  size="xs"
                  color={completed ? "green" : "gray"}
                  className={dashboard ? `me-2` : `mb-2`}
                >
                  {completed ? `Completed` : `To Do`}
                </Badge>

                <Bold
                  className={
                    dashboard
                      ? `text-sm leading-tight`
                      : `text-center text-sm leading-tight`
                  }
                >
                  {stepTitle} {!dashboard}
                </Bold>
              </div>
              {dashboard && (
                <div className="flex">
                  <Text>{stepDescription}</Text>
                </div>
              )}
            </div>
            {dashboard && (
              <Button
                size="xs"
                variant="primary"
                className="w-min px-4 py-1.5"
                onClick={() =>
                  router.push(
                    step.name === "setupSite" && siteId
                      ? stepURL[0] + siteId
                      : stepURL[0],
                  )
                }
              >
                {stepTitle} {activeStep ? "↓" : "→"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default function OnboardingGuide({
  dashboard,
}: {
  dashboard?: boolean;
}): JSX.Element {
  const pathName = usePathname();
  const [currentStep, setCurrentStep] = useState<number | null>(null);
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

    let currentStep = null;
    onboardingSteps.forEach((step, index) => {
      if (step.urls.some((url) => pathName.includes(url))) {
        currentStep = index;
      }
    });

    setCurrentStep(currentStep);

    // set a window function that can be called from other components to refresh the onboarding guide
    if (!(window as any)["refreshOnboarding"]) {
      (window as any)["refreshOnboarding"] = () => {
        action();
      };
    }
  }, [pathName]);

  const dismissGuide = useCallback(() => {
    setIsDismissing(true);
    saveOnboardingState(null).then(() => {
      setIsDismissing(false);
      setIsDismissed(true);
    });
  }, [setIsDismissing]);

  if (
    completedSteps === null ||
    isDismissed ||
    (pathName === "/" && !dashboard)
  ) {
    return <></>;
  }

  const ConditionalWrapper = ({
    condition,
    wrapper,
    children,
  }: {
    condition: boolean;
    wrapper: (children: React.ReactNode) => JSX.Element;
    children: React.ReactNode;
  }) => {
    return condition ? wrapper(children) : children;
  };

  return (
    <div
      className={
        `flex max-w-screen-xl flex-col space-y-2` + (!dashboard ? ` mb-4` : ``)
      }
    >
      {!dashboard && !isDismissed && (
        <div className="m-0 flex justify-between">
          <Bold>A quick guide to help you setup...</Bold>
          <Button
            variant="light"
            onClick={dismissGuide}
            className="m-0 p-0 text-sm underline"
          >
            Dismiss this guide
          </Button>
        </div>
      )}

      <Flex flexDirection="col" alignItems="stretch" className="gap-8">
        {dashboard && (
          <div className="flex flex-col text-start">
            <p className="mb-2 font-cal text-3xl font-bold">
              Welcome to Gitwallet!
            </p>
            <Text>Here&apos;s a quick guide to get you started.&nbsp;</Text>
          </div>
        )}

        <ConditionalWrapper
          condition={dashboard ?? true}
          wrapper={(children) => (
            <Card className="max-w-full p-4">{children}</Card>
          )}
        >
          <div className={dashboard ? `flex flex-col` : `flex flex-row`}>
            {onboardingSteps.map((step, index) => {
              return (
                // assuming 4 onboarding steps, so width is 1/4
                <div className={!dashboard ? `w-1/4` : ``} key={index}>
                  <TodoItem
                    index={index}
                    step={step as onBoardingStepType}
                    currentStep={currentStep}
                    completedSteps={completedSteps}
                    setCompletedSteps={setCompletedSteps}
                    dashboard={dashboard}
                  />
                  {dashboard && index !== onboardingSteps.length - 1 && (
                    <Divider className="my-5" />
                  )}
                </div>
              );
            })}
          </div>
        </ConditionalWrapper>
      </Flex>
      {dashboard && !isDismissed && (
        <div className="m-0 flex justify-end">
          <Button
            variant="light"
            onClick={dismissGuide}
            className="m-0 p-0 text-sm underline"
          >
            Dismiss this guide
          </Button>
        </div>
      )}
    </div>
  );
}
