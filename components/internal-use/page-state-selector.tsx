"use client";
import { Accordion, AccordionBody, AccordionHeader, Button } from "@tremor/react";
// import { PageStates } from "@/components/internal-use/PageStates";

interface PageStateSelectorProps<T> {
    pageState: T;
    setPageState: React.Dispatch<React.SetStateAction<T>>;
    statesEnum: { [s: string]: T };
}

export default function PageStateSelector<T>({ pageState, setPageState, statesEnum }: PageStateSelectorProps<T>) {

    return (
        <div className="fixed bottom-0 left-0 flex flex-row justify-center p-8 xl:px-32">
            <Accordion className="my-2">
                <AccordionHeader className="my-0 py-1">Page States</AccordionHeader>
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
