'use client';

import { Accordion, AccordionHeader, AccordionBody, Text, Flex, Bold, Button, AccordionList } from "@tremor/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaArrowLeft, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { saveState as saveOnboardingState } from "@/app/services/onboarding/OnboardingService";
import { onboardingSteps, type OnboardingStepsType } from "@/app/services/onboarding/onboarding-steps";
import { useSiteId } from "../dashboard/dashboard-context";



function TodoItem({ title, children, step, currentStep, pathName, completedSteps, setCompletedSteps }: any): JSX.Element {

    const [isSaving, setIsSaving] = useState(false);
    const [active, setActive] = useState(false);

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

    return (
        <div className="p-2 rounded-md border-none shadow-none w-full bg-neutral-100">
            <div className="p-2 cursor-pointer">
                <Flex alignItems="center" justifyContent="start" className="gap-3">
                    <input type="checkbox" className={checkboxClasses} checked={completedSteps?.[step]} onChange={handleCheckboxChange} onClick={(e) => e.stopPropagation()} />
                    <Bold>{title}</Bold>
                </Flex>
            </div>
            <div>
                <div className="p-2">
                    {children}
                </div>
            </div>
        </div>
    )
}
export default function OnboardingGuide({ dashboard }: { dashboard?: boolean }): JSX.Element {

    const pathName = usePathname();
    const router = useRouter()
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

        if (pathName.startsWith('/services/tiers')) {
            setCurrentStep(onboardingSteps.setupTiers);
        } else if (pathName.startsWith('/site')) {
            setCurrentStep(onboardingSteps.setupSite);
        } else if (pathName.startsWith('/settings')) {
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
        <div className="flex max-w-screen-xl flex-col space-y-4">
            <Flex flexDirection="col" alignItems="stretch" className="gap-6">
            <div className="text-start text-sm">
                    <Text className="">
                        <p>Here's a guide to help you get started with your site. You can dismiss this guide at any time.</p>
                    </Text>
            </div>

                <AccordionList>

                <Accordion defaultOpen={true}>
                        <AccordionHeader>Create and update your site</AccordionHeader>
                        
                        <AccordionBody className="p-2">
                            <Flex flexDirection="col" alignItems="start" className="gap-1">
                                <TodoItem
                                    title="Setup site / primary channel"
                                    step={onboardingSteps.setupSite}
                                    currentStep={currentStep}
                                    pathName={pathName}
                                    completedSteps={completedSteps}
                                    setCompletedSteps={setCompletedSteps}
                                >
                                    <Flex flexDirection="col" alignItems="start" className="gap-4">
                                        <p>Update your site settings or edit the default pages</p>
                                        <Flex className="gap-4" justifyContent="start">
                                            <>
                                                {!pathName.startsWith('/site') || !pathName.endsWith('/settings') ?
                                                    <Button size="xs" onClick={() => router.push(`/site/${siteId}/settings`)}>Site Settings</Button>
                                                    : null}
                                                {!pathName.startsWith('/site') || pathName.endsWith('/settings') ?
                                                    <Button size="xs" onClick={() => router.push(`/site/${siteId}`)}>Edit Homepage</Button>
                                                    : null}
                                            </>

                                        </Flex>
                                    </Flex>
                                </TodoItem>

                            </Flex>
                        </AccordionBody>
                    </Accordion>
                    <Accordion defaultOpen={true}>
                        <AccordionHeader>Setup your offerings and packages</AccordionHeader>
                        
                        <AccordionBody className="p-2">
                            <Flex flexDirection="col" alignItems="start" className="gap-1">
                                <TodoItem
                                    title="Setup tiers"
                                    step={onboardingSteps.setupTiers}
                                    currentStep={currentStep}
                                    pathName={pathName}
                                    completedSteps={completedSteps}
                                    setCompletedSteps={setCompletedSteps}
                                >
                                    <Flex flexDirection="col" alignItems="start" className="gap-4">
                                        <p>Add one or more tiers to present your services to prospective customers.</p>
                                        {currentStep === onboardingSteps.setupTiers ?
                                            <FaArrowLeft />
                                            : <Button size="xs" onClick={() => router.push('/services/tiers/new')}>Add Tier</Button>
                                        }
                                    </Flex>
                                </TodoItem>
                            </Flex>
                        </AccordionBody>
                    </Accordion>

                    <Accordion defaultOpen={true}>
                        <AccordionHeader>Add your payment information</AccordionHeader>

                        <AccordionBody className="p-2">
                            <Flex flexDirection="col" alignItems="start" className="gap-1">
                                <TodoItem
                                    title="Setup payment information"
                                    step={onboardingSteps.setupPayment}
                                    currentStep={currentStep}
                                    pathName={pathName}
                                    completedSteps={completedSteps}
                                    setCompletedSteps={setCompletedSteps}
                                >
                                    <Flex flexDirection="col" alignItems="start" className="gap-4">
                                        <p>Update your payment information</p>
                                        {currentStep === onboardingSteps.setupPayment ?
                                            <FaArrowLeft />
                                            :
                                            <Button size="xs" onClick={() => router.push('/settings')}>Setup payment</Button>
                                        }
                                    </Flex>
                                </TodoItem>
                            </Flex>
                        </AccordionBody>
                    </Accordion>
                    
                <Flex justifyContent="end" alignItems="center" className="gap-4 p-2">
                                    <Button icon={IoIosClose} loading={isDismissing} disabled={isDismissing} variant="light" iconPosition="right" onClick={dismissGuide}>Dismiss this guide</Button>
                                </Flex>
                </AccordionList>
            </Flex>
        </div>
    )
}
