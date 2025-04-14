import { useCallback, useState } from "react";
import ComponentsPanel from "./components-panel";
import ThemesPanel from "./themes-panel";

export default function PageEditorSidebar({
  editorRef,
  monacoRef
}: {
  editorRef: any;
  monacoRef: any;
}) {
  const [activeTab, setActiveTab] = useState(0);

  const insertAtCursor = useCallback(
    (textToInsert: string) => {
      console.log("editorRef", editorRef);
      if (!editorRef) return;

      const selection = editorRef.getSelection();
      const id = { major: 1, minor: 1 };
      const op = {
        identifier: id,
        range: selection,
        text: textToInsert,
        forceMoveMarkers: true
      };
      editorRef.executeEdits("my-source", [op]);

      // Calculate the new range where the text was inserted
      const newLines = textToInsert.split("\n"),
        numLines = newLines.length,
        endColumn = newLines[numLines - 1].length + 1;
      const newRange = new monacoRef.Range(
        selection.startLineNumber,
        selection.startColumn,
        selection.startLineNumber + numLines - 1,
        numLines === 1 ? selection.startColumn + endColumn : endColumn
      );

      const decoration = {
        range: newRange,
        options: {
          isWholeLine: false,
          className: "bg-orange-200"
        }
      };

      const decorationIds = editorRef.deltaDecorations([], [decoration]);

      // remove the decoration after 3 seconds
      setTimeout(() => {
        editorRef.deltaDecorations(decorationIds, []);
      }, 3000);
    },
    [editorRef, monacoRef]
  );

  return (
    <div className="pl-4">
      <div className="text-md py-2 font-bold">
        <span>Add Content</span>
      </div>
      <hr className="my-0 h-px w-full bg-black/10" />
      <div className="mt-2 flex flex-col gap-6">
        <div className="mt-4 flex flex-col gap-2">
          <div className="text-sm font-bold">Dynamic Content</div>
          <ComponentsPanel insertAtCursor={insertAtCursor} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-bold">Layout Sections</div>
          <ThemesPanel insertAtCursor={insertAtCursor} />
        </div>
      </div>
    </div>
  );
}
