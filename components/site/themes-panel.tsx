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
                    <div className="relative w-full h-full overflow-hidden rounded-md group"
                        onClick={() => {
                            insertSection(section)
                        }}
                        >
                            <PreviewSection content={section.template} />
                        <div className="absolute bottom-0 left-0 w-full p-2 text-white font-bold bg-black bg-opacity-50 rounded-b-md transform translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            { section.name }
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
