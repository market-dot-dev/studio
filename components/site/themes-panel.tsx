
import { useCallback } from "react";

import PreviewSection from "./preview-section";
import siteTemplates from "@/lib/constants/site-templates";

export default function ThemesPanel({ insertAtCursor }: {insertAtCursor: (prop: string) => void}) {

    const insertSection = useCallback((section: any) => {
        insertAtCursor(`
<!--Start ${section.name}-->
${section.template}
<!--End ${section.name}-->
`);
    }, [insertAtCursor]);


    return (
        <div className="flex flex-col gap-6">
            { siteTemplates.map((section, index) => (
                <div key={index} className="p-0 cursor-pointer text-sm align-middle text-center shadow-sm rounded-md border">
                    <div className="w-full h-full overflow-hidden rounded-md relative"
                        onClick={() => {
                            insertSection(section)
                        }}
                        >
                            <PreviewSection content={section.template} />
                        <div className="p-2 absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white font-bold rounded-b-md">
                            { section.name }
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

