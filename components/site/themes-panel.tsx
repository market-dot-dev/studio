import siteTemplates from "@/lib/constants/site-templates";
import { useCallback } from "react";
import PreviewSection from "./preview-section";

export function ThemesPanel({ insertAtCursor }: { insertAtCursor: (prop: string) => void }) {
  const insertSection = useCallback(
    (section: { name: string; template: string }) => {
      insertAtCursor(`
<!--Start ${section.name}-->
${section.template}
<!--End ${section.name}-->
`);
    },
    [insertAtCursor]
  );

  return (
    <div className="flex flex-col gap-6">
      {siteTemplates.map((section, index) => (
        <div
          key={index}
          className="cursor-pointer rounded-md border p-0 text-center align-middle text-sm shadow-sm"
        >
          <button
            className="group relative size-full overflow-hidden rounded-md"
            onClick={() => {
              insertSection(section);
            }}
          >
            <PreviewSection
              content={section.template}
              width={250}
              height={200}
              screenWidth={1600}
              screenHeight={1280}
            />
            <div className="bg-opacity/50 absolute bottom-0 left-0 w-full translate-y-full rounded-b-md bg-black p-2 font-bold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {section.name}
            </div>
          </button>
        </div>
      ))}
    </div>
  );
}
