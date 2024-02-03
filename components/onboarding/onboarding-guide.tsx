'use client';

import { Card, Title, List, Text, Flex, Bold, Button, AccordionList, Badge, Divider } from "@tremor/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaArrowLeft, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { saveState as saveOnboardingState } from "@/app/services/onboarding/OnboardingService";
import { onboardingSteps, type OnboardingStepsType, onboardingStepsDescription, onboardingStepsTitles, onboardingStepsURLs } from "@/app/services/onboarding/onboarding-steps";
import { useSiteId } from "../dashboard/dashboard-context";
import Link from "next/link";



function TodoItem({ title, children, step, currentStep, pathName, completedSteps, setCompletedSteps }: any): JSX.Element {

    const [isSaving, setIsSaving] = useState(false);
    const [active, setActive] = useState(false);
    const router = useRouter()


    // this function is called when the tier is saved, by means of a tier-saved event
    const saveTierCompleted = useCallback(() => {
        setIsSaving(true);
        setCompletedSteps((prev: any) => {
            return {
                ...prev,
                [onboardingSteps.setupTiers]: true
            }
        })
    }, [setCompletedSteps]);

    useEffect(() => {
        // listen for tier-saved event
        if (currentStep === onboardingSteps.setupTiers) {
            window.addEventListener('tier-saved', saveTierCompleted);
        }

        return () => {
            if (currentStep === onboardingSteps.setupTiers) {
                window.removeEventListener('tier-saved', saveTierCompleted);
            }
        }
    }, [currentStep]);

    // on checkbox click
    const handleCheckboxChange = useCallback((e: any) => {
        setIsSaving(true);
        setCompletedSteps((prev: OnboardingStepsType) => {
            const newState = {
                ...prev,
                [step]: e.target.checked
            }
            return newState;
        })

    }, [setCompletedSteps])

    const checkboxClasses = 'rounded-full outline-none focus:outline-none focus:border-none' + (isSaving ? ' opacity-50 cursor-not-allowed animate-spin' : '');

    useEffect(() => {
        if (isSaving) {
            // saving to db here, because we need to set the 'saving' indicator on this item only.
            // and after isSaving is set to true, the updated completed step status will be available here
            saveOnboardingState(completedSteps).then(() => {
                setIsSaving(false);
            });

        }
    }, [completedSteps[step]])

    const stepTitle = onboardingStepsTitles[step as keyof typeof onboardingStepsTitles];
    const url = onboardingStepsURLs[step as keyof typeof onboardingStepsURLs];
    const description = onboardingStepsDescription[step as keyof typeof onboardingStepsDescription];

    return (
        <div className="w-full">
            <div className="px-1 mb-2">
                <div className="flex items-center justify-start gap-3" onClick={handleCheckboxChange}>
                    <input type="checkbox" className={checkboxClasses} checked={completedSteps?.[step]} onChange={handleCheckboxChange} onClick={(e) => e.stopPropagation()} />
                    <Bold>{stepTitle}</Bold>
                </div>
                <div className="flex">
                    <Text>{description}</Text>
                </div>
            </div>
            <div>
                <div className="p-0 leading-tight">
                    {children}
                </div>
            </div>
            <Button size="xs" onClick={() => router.push(url)}>{url}</Button>
        </div>
    )
}
export default function OnboardingGuide({ dashboard }: { dashboard?: boolean }): JSX.Element {

    const pathName = usePathname();
    const [currentStep, setCurrentStep] = useState<string | null>(null);
    const [completedSteps, setCompletedSteps] = useState(null);
    const [isDismissing, setIsDismissing] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    const siteId = useSiteId();

    useEffect(() => {
        // refer to the db everytime you navigate to a new page
        fetch('/api/onboarding').then(res => res.json()).then(data => {
            if (data && data.length) {
                setCompletedSteps(JSON.parse(data));
            }
        });

        if (pathName.includes('/project')) {
            setCurrentStep(onboardingSteps.setupProject);
        } else if (pathName.startsWith('/services/tiers')) {
            setCurrentStep(onboardingSteps.setupTiers);
        } else if (pathName.startsWith('/site')) {
            setCurrentStep(onboardingSteps.setupSite);
        } else if (pathName.startsWith('/settings/payment')) {
            setCurrentStep(onboardingSteps.setupPayment);
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
        return (
            <></>
        );
    }

    return (
        <div className={`flex max-w-screen-xl flex-col space-y-4` + (!dashboard ? ` p-8` : ``)}>
            <Flex flexDirection="col" alignItems="stretch" className="gap-6">

                {dashboard &&
                    <div className="flex gap-1">
                        <p className="text-start text-md font-semibold">
                            Welcome to Gitwallet. Here's a quick guide to get you started.&nbsp;
                        </p>
                    </div>}

                <Card className="max-w-full p-4">

                    <div className={dashboard ? `flex flex-col` : `flex flex-row`}>
                        <TodoItem
                            title="Setup your project"
                            step={onboardingSteps.setupProject}
                            currentStep={currentStep}
                            pathName={pathName}
                            completedSteps={completedSteps}
                            setCompletedSteps={setCompletedSteps}
                            className=""
                        />

                        {dashboard && <Divider className="my-3" />}

                        <TodoItem
                            step={onboardingSteps.setupTiers}
                            currentStep={currentStep}
                            pathName={pathName}
                            completedSteps={completedSteps}
                            setCompletedSteps={setCompletedSteps}
                        />

                        {dashboard && <Divider className="my-3" />}

                        <TodoItem
                            step={onboardingSteps.setupSite}
                            currentStep={currentStep}
                            pathName={pathName}
                            completedSteps={completedSteps}
                            setCompletedSteps={setCompletedSteps}
                        />


                        {dashboard && <Divider className="my-3" />}

                        <TodoItem
                            step={onboardingSteps.setupPayment}
                            currentStep={currentStep}
                            pathName={pathName}
                            completedSteps={completedSteps}
                            setCompletedSteps={setCompletedSteps}
                        />

                    </div>
                </Card>
            </Flex>
            <div className="flex justify-end m-0">
                <Button variant="light" onClick={dismissGuide} className="m-0 p-0 text-sm underline">Dismiss this guide</Button>
            </div>
        </div>
    )
}
