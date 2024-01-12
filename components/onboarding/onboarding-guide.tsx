'use client';

import { Accordion, AccordionHeader, AccordionBody, AccordionList, Flex, Bold, Card, Button } from "@tremor/react";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function TodoItem({ title, children, step, currentStep, pathName} : any) : JSX.Element {
    
    const [open, setOpen] = useState(step === currentStep);
    
    useEffect(() => {
        setOpen(step === currentStep);
    }, [step, currentStep, pathName])

    // on checkbox click
    const handleCheckboxClick = useCallback((e: any) => {
        e.stopPropagation();
    }, [])

    const togglePanel = useCallback((e: any) => {
        setOpen((prev) => !prev);
    }, []);

    
    const cardClasses = 'p-2 rounded-md border-none shadow-none w-full' + (open ? ' bg-neutral-100' : '');
    const bodyClasses = 'overflow-hidden' + (open ? ' max-h-max' : ' max-h-0');
    return (
        <div className={ cardClasses }>
                <div className="p-2 cursor-pointer" onClick={togglePanel}>
                    <Flex alignItems="center" justifyContent="start" className="gap-3">
                        <input type="checkbox" onClick={handleCheckboxClick} />
                        <Bold>{title}</Bold>
                    </Flex>
                </div>
                <div className={bodyClasses}>
                    <div className="p-2">
                        {open}
                        {children}
                    </div>
                </div>
            
        </div>
    )
}
export default function OnboardingGuide({dashboard} : {dashboard?: boolean}) : JSX.Element {
    const pathName = usePathname();
    const [currentStep, setCurrentStep] = useState<string | null>(null);
    useEffect(() => {
        if( pathName.startsWith('/services/tiers')) {
            setCurrentStep('tiers');
        } else if (pathName.startsWith('/site')) {
            setCurrentStep('site');
        } else if(pathName.startsWith('/settings')) {
            setCurrentStep('settings');
        }
    }, [pathName])

    if(pathName === '/' && !dashboard) {
        return (
            <></>
        );
    }

    return (
        <Flex flexDirection="col" alignItems="stretch" className="gap-6">
            <Bold>Next Steps</Bold>
                <Accordion defaultOpen={true}>
                    <AccordionHeader>Setup Guide</AccordionHeader>
                    <div className="px-4 pb-4 text-sm">
                        <p>Use this personalized guide to get your store up and running.</p>
                    </div>
                    <AccordionBody className="p-2">
                        <Flex flexDirection="col" alignItems="start" className="gap-1">
                            <TodoItem title="Setup tiers" step="tiers" currentStep={currentStep} pathName={pathName}>
                                <Flex flexDirection="col" alignItems="start" className="gap-4">
                                    <p>Add one or more tiers to present your services to prospective customers.</p>
                                    <Button size="xs">Add Tier</Button>
                                </Flex>
                            </TodoItem>
                            <TodoItem title="Setup payment information" step="settings" currentStep={currentStep} pathName={pathName}>
                                <Flex flexDirection="col" alignItems="start" className="gap-4">
                                    <p>Update your payment information</p>
                                    <Button size="xs">Setup payment</Button>
                                </Flex>
                            </TodoItem>
                            <TodoItem title="Setup site / primary channel" step="site" currentStep={currentStep} pathName={pathName}>
                                <Flex flexDirection="col" alignItems="start" className="gap-4">
                                    <p>Update your site settings or edit the default pages</p>
                                    <Flex className="gap-4" justifyContent="start">
                                        <Button size="xs">Site Settings</Button>
                                        <Button size="xs">Edit Homepage</Button>
                                    </Flex>
                                </Flex>
                            </TodoItem>
                        </Flex>
                    </AccordionBody>
                </Accordion>
            
            
        </Flex>
    )
}