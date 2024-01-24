"use client";
import { Accordion, AccordionBody, AccordionHeader, Button } from "@tremor/react";

interface PageStateSelectorProps<T> {
    pageName: string;
    pageState: T;
    setPageState: React.Dispatch<React.SetStateAction<T>>;
    statesEnum: { [s: string]: T };
    position: 'left' | 'right';
}

export default function PageStateSelector<T>({ pageName, pageState, setPageState, statesEnum, position }: PageStateSelectorProps<T>) {

    return (
        <div className={`fixed bottom-0 ${position === 'left' ? 'left-0' : 'right-0'} flex flex-row justify-center p-8 z-50`}>
            <Accordion className="my-2 border-4 border-green-400">
                <AccordionHeader className="my-0 py-1">Page States: {pageName}</AccordionHeader>
                <AccordionBody>
                    <div className="flex flex-col gap-2 text-sm font-light leading-6 mb-4">
                        <label className="text-sm font-light">Current State: <br />{String(pageState)}</label>
                        {Object.values(statesEnum).map((state: T) => (
                            <Button key={String(state)} onClick={() => setPageState(state)}>
                                {String(state)}
                            </Button>
                        ))}
                    </div>
                </AccordionBody>
            </Accordion>
        </div>
    );
}
