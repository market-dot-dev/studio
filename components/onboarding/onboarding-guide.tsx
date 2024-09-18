'use client';

import { Card, Text, Flex, Bold, Button, Icon, Badge } from "@tremor/react";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { saveState as saveOnboardingState } from "@/app/services/onboarding/OnboardingService";
import { onboardingSteps, type OnboardingStepsType, onBoardingStepType } from "@/app/services/onboarding/onboarding-steps";
import { getState } from "@/app/services/onboarding/OnboardingService";
import { useSiteId } from "../dashboard/dashboard-context";
import { Check, BadgeAlert, ArrowRight, ArrowLeft } from "lucide-react";

function TodoItem({ step, completedSteps, setCompletedSteps, dashboard }: {
    step: onBoardingStepType,
    completedSteps: OnboardingStepsType,
    setCompletedSteps: (steps: OnboardingStepsType) => void,
    dashboard?: boolean
}): JSX.Element {
    const router = useRouter()
    const siteId = useSiteId();

    const { title: stepTitle, urls: stepURL, description: stepDescription, icon: stepIcon } = step;

    const stepIconDiv =
        <div className="me-2">
            <Icon icon={stepIcon} size={"xl"} />
        </div>;

    const completed = completedSteps?.[step.name] === true;

    return (
        <div className="flex flex-col items-center text-center">
            {stepIconDiv}
            {step.name !== 'welcome' && (
                <Badge icon={completed ? Check : BadgeAlert} size="xs" color={completed ? "green" : "gray"} className="mb-2">
                    {completed ? `Completed` : `To Do`}
                </Badge>
            )}
            <Bold className="text-lg mb-2">{stepTitle}</Bold>
            <Text className="mb-4">{stepDescription}</Text>
            {step.name !== 'welcome' && (
                <Button 
                    size="sm" 
                    variant="primary" 
                    className="w-full"
                    onClick={() => router.push(step.name === 'setupSite' && siteId ? stepURL[0] + siteId : stepURL[0])}
                >
                    {completed ? "Review" : "Start"} {stepTitle}
                </Button>
            )}
        </div>
    )
}

export default function OnboardingGuide({ dashboard }: { dashboard?: boolean }): JSX.Element {
    const pathName = usePathname();
    const router = useRouter();
    const siteId = useSiteId();
    const [completedSteps, setCompletedSteps] = useState<OnboardingStepsType>(null);
    const [isDismissing, setIsDismissing] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    useEffect(() => {
        const action = async () => {
            const state = await getState() as OnboardingStepsType;
            setCompletedSteps(state);
        }

        action();

        if (!(window as any)['refreshOnboarding']) {
            (window as any)['refreshOnboarding'] = action;
        }

        // Find the current step index based on the current path
        const index = onboardingSteps.findIndex(step => step.urls.some(url => pathName.includes(url)));
        if (index !== -1) {
            setCurrentStepIndex(index);
        }
    }, [pathName])

    const dismissGuide = useCallback(() => {
        setIsDismissing(true);
        saveOnboardingState(null).then(() => {
            setIsDismissing(false);
            setIsDismissed(true);
        });
    }, [setIsDismissing]);

    if (completedSteps === null || isDismissed || (pathName === '/' && !dashboard)) {
        return <></>;
    }

    // Update the type definition of navigateToStep
    const navigateToStep = (step: typeof onboardingSteps[number]) => {
        if (step.name !== 'welcome' && step.urls.length > 0) {
            const url = step.name === 'setupSite' && siteId ? step.urls[0] + siteId : step.urls[0];
            router.push(url);
        }
    };

    const nextStep = () => {
        if (currentStepIndex < onboardingSteps.length - 1) {
            const nextStepIndex = currentStepIndex + 1;
            setCurrentStepIndex(nextStepIndex);
            navigateToStep(onboardingSteps[nextStepIndex]);
        }
    };

    const prevStep = () => {
        if (currentStepIndex > 0) {
            const prevStepIndex = currentStepIndex - 1;
            setCurrentStepIndex(prevStepIndex);
            navigateToStep(onboardingSteps[prevStepIndex]);
        }
    };

    return (
        <div className={`flex max-w-screen-xl flex-col space-y-2 ${!dashboard ? 'mb-4' : ''}`}>
            {dashboard &&
                <div className="flex flex-col text-start mb-4">
                    <p className="font-cal text-3xl font-bold mb-2">
                        Welcome to Gitwallet!
                    </p>
                    <Text>Here&apos;s a quick guide to get you started.&nbsp;</Text>
                </div>
            }

            <Card className="max-w-full p-4">
                {/* Progress indicator */}
                <div className="flex justify-between mb-6">
                    {onboardingSteps.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 w-full ${
                                index <= currentStepIndex ? "bg-blue-500" : "bg-gray-200"
                            } ${index === 0 ? "rounded-l-full" : ""} ${
                                index === onboardingSteps.length - 1 ? "rounded-r-full" : ""
                            }`}
                        />
                    ))}
                </div>

                {/* Current step */}
                <TodoItem
                    step={onboardingSteps[currentStepIndex] as onBoardingStepType}
                    completedSteps={completedSteps}
                    setCompletedSteps={setCompletedSteps}
                    dashboard={dashboard}
                />

                {/* Navigation buttons */}
                <div className="flex justify-between mt-6">
                    <Button
                        variant="secondary"
                        onClick={prevStep}
                        disabled={currentStepIndex === 0}
                        icon={ArrowLeft}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="primary"
                        onClick={nextStep}
                        disabled={currentStepIndex === onboardingSteps.length - 1}
                        icon={ArrowRight}
                        iconPosition="right"
                    >
                        Next
                    </Button>
                </div>
            </Card>

            {!isDismissed &&
                <div className="flex justify-end mt-2">
                    <Button variant="light" onClick={dismissGuide} className="text-sm underline">
                        Dismiss this guide
                    </Button>
                </div>
            }
        </div>
    )
}
