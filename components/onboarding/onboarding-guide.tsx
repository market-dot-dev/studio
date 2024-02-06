'use client';

import { Card, Title, List, Text, Flex, Bold, Button, AccordionList, Badge, Divider } from "@tremor/react";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { saveState as saveOnboardingState } from "@/app/services/onboarding/OnboardingService";
import { onboardingSteps, type OnboardingStepsType, onboardingStepsDescription, onboardingStepsTitles, onboardingStepsURLs, defaultOnboardingState } from "@/app/services/onboarding/onboarding-steps";
import { useSiteId } from "../dashboard/dashboard-context";


function TodoItem({ title, children, step, currentStep, pathName, completedSteps, setCompletedSteps, dashboard }: any): JSX.Element {

    const [isSaving, setIsSaving] = useState(false);
    const [active, setActive] = useState(false);
    const router = useRouter()
    const siteId = useSiteId();



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
    // const handleCheckboxChange = useCallback((e: any) => {
    //     setIsSaving(true);
    //     setCompletedSteps((prev: OnboardingStepsType) => {
    //         const newState = {
    //             ...prev,
    //             [step]: e.target.checked
    //         }
    //         return newState;
    //     })

    // }, [setCompletedSteps])

    // const checkboxClasses = 'rounded-full outline-none focus:outline-none focus:border-none' + (isSaving ? ' opacity-50 cursor-not-allowed animate-spin' : '');

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
    const stepURL = onboardingStepsURLs[step as keyof typeof onboardingStepsURLs];
    const stepDescription = onboardingStepsDescription[step as keyof typeof onboardingStepsDescription];
    const activeStep = currentStep === step;

    return (
        <div className={!dashboard && activeStep ? `mx-2 p-4 rounded-xl w-full bg-gray-200` : !dashboard ? `p-4 w-full` : ``}>
            <div className="px-1 mb-2">
                {/* <div className="flex items-center justify-start gap-3" onClick={handleCheckboxChange}> */}
                <div className="flex items-center justify-start gap-3">
                    {/* <input type="checkbox" className={checkboxClasses} checked={completedSteps?.[step]} onChange={handleCheckboxChange} onClick={(e) => e.stopPropagation()} /> */}
                    <Bold>{stepTitle}</Bold>
                </div>
                <div className="flex">
                    <Text>{stepDescription}</Text>
                </div>
            </div>
            <div>
                <div className="p-0 leading-tight">
                    {children}
                </div>
            </div>

            <Button size="xs" variant="primary" className="py-0 px-2" onClick={() => router.push(step === onboardingSteps.setupSite && siteId ? stepURL + siteId : stepURL)}>{stepTitle} {activeStep ? "↓" : "→"}</Button>
        </div>
    )
}
export default function OnboardingGuide({ dashboard }: { dashboard?: boolean }): JSX.Element {

    const pathName = usePathname();
    const [currentStep, setCurrentStep] = useState<string | null>(null);
    const [completedSteps, setCompletedSteps] = useState(null);
    const [isDismissing, setIsDismissing] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);


    useEffect(() => {
        // refer to the db everytime you navigate to a new page
        fetch('/api/onboarding').then(res => res.json()).then(data => {
            if (data && data.length) {
                setCompletedSteps(JSON.parse(data));
            }
        });

        if (pathName.includes(onboardingStepsURLs.setupProject)) {
            setCurrentStep(onboardingSteps.setupProject);
        } else if (pathName.includes(onboardingStepsURLs.setupTiers)) {
            setCurrentStep(onboardingSteps.setupTiers);
        } else if (pathName.includes(onboardingStepsURLs.setupSite)) {
            setCurrentStep(onboardingSteps.setupSite);
        } else if (pathName.includes(onboardingStepsURLs.setupPayment)) {
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

    // for debugging purposes only, only shown in development
    if( (process.env.NODE_ENV === "development") && (completedSteps === null || isDismissed) && (pathName === '/' && dashboard)) {
        return (
            <div className="p-4 w-1/2">
                <Card className='border-2 border-slate-800 bg-slate-50'>
                    <Badge size="xs" className="me-2 mb-1.5">FOR DEBUGGING PURPOSES ONLY</Badge>
                    <Title>Restore Onboarding Guide</Title>
                    <Button onClick={() => {
                        saveOnboardingState(defaultOnboardingState).then(() => {
                            const newState = { ...defaultOnboardingState };
                            setCompletedSteps((prev : any) => {
                                return {
                                    ...prev,
                                    ...newState
                                }
                            });
                            setIsDismissed(false);
                        })
                    }}>Restore</Button>
                </Card>
            </div>
        );
    }


    if (completedSteps === null || isDismissed || (pathName === '/' && !dashboard)) {
        return (
            <></>
        );
    }


    const ConditionalWrapper = ({ condition, wrapper, children }: { condition: boolean, wrapper: (children: React.ReactNode) => JSX.Element, children: React.ReactNode }) => {
        return condition ? wrapper(children) : children;
    };

    return (
        <div className={`flex max-w-screen-xl flex-col space-y-4` + (!dashboard ? ` p-8` : ``)}>
            <Flex flexDirection="col" alignItems="stretch" className="gap-8">

                {dashboard &&
                    <div className="flex gap-1">
                        <p className="text-start text-md font-semibold">
                            Welcome to Gitwallet. Here&apos;s a quick guide to get you started.&nbsp;
                        </p>
                    </div>}


                <ConditionalWrapper condition={dashboard ?? false}
                        wrapper={children => 
                        <Card className="max-w-full p-4">
                            {children}
                        </Card>
                    }
                >
                    <div className={dashboard ? `flex flex-col` : `flex flex-row`}>
                        <TodoItem
                            title="Setup your project"
                            step={onboardingSteps.setupProject}
                            currentStep={currentStep}
                            pathName={pathName}
                            completedSteps={completedSteps}
                            setCompletedSteps={setCompletedSteps}
                            dashboard={dashboard}
                            className=""
                        />

                        {dashboard && <Divider className="my-3" />}

                        <TodoItem
                            step={onboardingSteps.setupTiers}
                            currentStep={currentStep}
                            pathName={pathName}
                            completedSteps={completedSteps}
                            setCompletedSteps={setCompletedSteps}
                            dashboard={dashboard}
                        />

                        {dashboard && <Divider className="my-3" />}

                        <TodoItem
                            step={onboardingSteps.setupSite}
                            currentStep={currentStep}
                            pathName={pathName}
                            completedSteps={completedSteps}
                            setCompletedSteps={setCompletedSteps}
                            dashboard={dashboard}
                        />


                        {dashboard && <Divider className="my-3" />}

                        <TodoItem
                            step={onboardingSteps.setupPayment}
                            currentStep={currentStep}
                            pathName={pathName}
                            completedSteps={completedSteps}
                            setCompletedSteps={setCompletedSteps}
                            dashboard={dashboard}
                        />

                    </div>
                </ConditionalWrapper>
            </Flex>
            <div className="flex justify-end m-0">
                <Button variant="light" onClick={dismissGuide} className="m-0 p-0 text-sm underline">Dismiss this guide</Button>
            </div>
        </div>
    )
}
