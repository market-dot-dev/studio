"use client";

import Editor, { type Monaco } from "@monaco-editor/react";
import clsx from "clsx";
import {
  Code,
  Eye,
  Maximize,
  Minimize,
  SquareArrowOutUpRight,
  SquareSplitHorizontal
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import renderElement from "./page-renderer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import type { PageContent, SiteDetails } from "@/types/site";
import Link from "next/link";
import { useFullscreen } from "../dashboard/dashboard-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import PageEditorSidebar from "./page-editor-sidebar";
import { PreviewFrame } from "./preview-frame";
import { useIsMobile } from "@/hooks/use-mobile";

// Custom Monaco theme using Tailwind colors
const stoneSwampTheme = {
  base: 'vs' as const,
  inherit: true,
  rules: [
    // Comments - stone-500 (muted)
    { token: 'comment', foreground: '746D69', fontStyle: 'italic' },
    { token: 'comment.doc', foreground: '746D69', fontStyle: 'italic' },
    
    // Keywords - swamp default
    { token: 'keyword', foreground: '808054', fontStyle: 'bold' },
    { token: 'keyword.control', foreground: '808054', fontStyle: 'bold' },
    { token: 'keyword.operator', foreground: '808054' },
    
    // Strings - marketing green
    { token: 'string', foreground: '#56599C' },
    { token: 'string.escape', foreground: '878E6B', fontStyle: 'bold' },
    
    // Numbers - marketing orange
    { token: 'number', foreground: 'B28634' },
    { token: 'number.float', foreground: 'B28634' },
    { token: 'number.hex', foreground: 'B28634' },
    
    // Functions/Methods - marketing purple
    { token: 'function', foreground: '76789E', fontStyle: 'bold' },
    { token: 'function.call', foreground: '76789E' },
    { token: 'method', foreground: '76789E' },
    
    // Tags (HTML/XML) - swamp-400
    { token: 'tag', foreground: '808054', fontStyle: 'bold' },
    { token: 'delimiter.html', foreground: '808054' },
    { token: 'delimiter.xml', foreground: '808054' },
    
    // Attributes - swamp-300
    { token: 'attribute.name', foreground: '70704D' },
    { token: 'attribute.value', foreground: '56599C' },
    
    // Variables/Identifiers - darker stone/default text
    { token: 'variable', foreground: '4F4F36' },
    { token: 'identifier', foreground: '4F4F36' },
    { token: 'constant', foreground: 'B28634', fontStyle: 'bold' },
    
    // Types/Classes - marketing purple
    { token: 'type', foreground: '76789E' },
    { token: 'class', foreground: '76789E', fontStyle: 'bold' },
    { token: 'interface', foreground: '76789E' },
    
    // Operators - swamp-500
    { token: 'operator', foreground: '70704D' },
    { token: 'delimiter', foreground: '70704D' },
    
    // Regular expressions - marketing orange accent
    { token: 'regexp', foreground: 'B28634', fontStyle: 'underline' },
    
    // Invalid/Error - using a reddish tone
    { token: 'invalid', foreground: 'EF4444', fontStyle: 'underline' }
  ],
  colors: {
    // Editor background and text - stone colors
    'editor.background': '#FFFFFF', // Pure white background
    'editor.foreground': '#2E2D1F', // swamp-700 (darker for text)
    
    // Cursor and selection - swamp colors
    'editorCursor.foreground': '#808054',
    'editor.selectionBackground': '#C5C5AA66', // swamp-100 with transparency
    'editor.inactiveSelectionBackground': '#C5C5AA33',
    'editor.selectionHighlightBackground': '#CDCEB644',
    
    // Line highlights - stone with subtle tint
    'editor.lineHighlightBackground': '#F3F2F208',
    'editor.lineHighlightBorder': '#E3E0DF',
    
    // Find matches - marketing orange tints
    'editor.findMatchBackground': '#b28634',
    'editor.findMatchHighlightBackground': '#b28634',
    
    // Line numbers - stone-400 color
    'editorLineNumber.foreground': '#A8A29E', // stone-400
    'editorLineNumber.activeForeground': '#808054',
    
    // Indentation guides - stone colors
    'editorIndentGuide.background': '#E3E0DF',
    'editorIndentGuide.activeBackground': '#C5C5AA',
    
    // Bracket matching - swamp
    'editorBracketMatch.background': '#C5C5AA44',
    'editorBracketMatch.border': '#808054',
    
    // Gutter and rulers
    'editorGutter.background': '#FFFFFF',
    'editorRuler.foreground': '#E3E0DF',
    
    // Whitespace
    'editorWhitespace.foreground': '#E3E0DF',
    
    // Error/Warning/Info decorations
    'editorError.foreground': '#EF4444',
    'editorWarning.foreground': '#F59E0B',
    'editorInfo.foreground': '#76789E',
    'editorHint.foreground': '#7D8861',
    
    // Widget backgrounds (autocomplete, hover, etc.)
    'editorWidget.background': '#FFFFFF',
    'editorWidget.border': '#E3E0DF',
    'editorHoverWidget.background': '#FFFFFF',
    'editorHoverWidget.border': '#E3E0DF',
    
    // Suggest widget (autocomplete dropdown)
    'editorSuggestWidget.background': '#FFFFFF',
    'editorSuggestWidget.border': '#E3E0DF',
    'editorSuggestWidget.foreground': '#2E2D1F',
    'editorSuggestWidget.highlightForeground': '#808054',
    'editorSuggestWidget.selectedBackground': '#C5C5AA44',
    
    // Scrollbar
    'scrollbarSlider.background': '#E3E0DF66',
    'scrollbarSlider.hoverBackground': '#C5C5AA66',
    'scrollbarSlider.activeBackground': '#80805488',
    
    // Overview ruler (minimap border)
    'editorOverviewRuler.border': '#E3E0DF',
    
    // Active link
    'editorLink.activeForeground': '#76789E'
  }
};

interface PageEditorProps {
  site: SiteDetails;
  page: PageContent;
  siteUrl: string | null;
  isDraft: boolean;
  titleError: string | null;
  slugError: string | null;
  onTitleChange: (title: string) => void;
  onSlugChange: (slug: string) => void;
  onContentChange: (content: string) => void;
  onSave: () => Promise<void>;
  inProgress: boolean;
}

export default function PageEditor({
  site,
  page,
  siteUrl,
  isDraft,
  titleError,
  slugError,
  onTitleChange,
  onSlugChange,
  onContentChange,
  onSave,
  inProgress
}: PageEditorProps) {
  const isHome = page.id === site.homepageId;

  const [editorRef, setEditorRef] = useState<any>(null);
  const [monacoRef, setMonacoRef] = useState<any>(null);

  // 0: "preview",
  // 1: "code",
  // 2: "split",
  const [viewMode, setViewMode] = useState<number>(0);

  const [previewElement, setPreviewElement] = useState<any>(null);

  const { fullscreen, setFullscreen } = useFullscreen();
  const isMobile = useIsMobile();

  // Define custom theme before mounting editor
  const handleBeforeMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('stoneSwamp', stoneSwampTheme);
  };

  function handleEditorDidMount(editor: any, monaco: any) {
    setMonacoRef(monaco);
    setEditorRef(editor);
  }

  const generatePreview = useCallback(() => {
    try {
      const parser = new DOMParser();
      const content = typeof page?.content === "string" ? page.content : "";
      const doc = parser.parseFromString(content, "text/html");
      const rootElement = doc.body.children;
      setPreviewElement(Array.from(rootElement));
    } catch (error) {
      console.log(error);
    }
  }, [page?.content]);

  // Restore the useEffect for viewMode changes
  useEffect(() => {
    if (viewMode === 0 || viewMode === 2) {
      generatePreview();
    } else {
      setPreviewElement(null);
    }
  }, [viewMode, generatePreview]);

  // Preview generation on content changes
  useEffect(() => {
    // Only regenerate preview when content changes
    if (page?.content) {
      const previewTimeout = setTimeout(generatePreview, 500);
      return () => clearTimeout(previewTimeout);
    }
  }, [page?.content, generatePreview]);

  // Handle automatic view mode switching when screen size changes
  useEffect(() => {
    // If on mobile and in split view
    if (isMobile && viewMode === 2) {
      setViewMode(1); // Switch to code view
    }
  }, [isMobile, viewMode]);

  const linkWithSlug = siteUrl ? siteUrl + (isHome ? "" : page.slug || "") : "";

  const preview = (
    <PreviewFrame>
      {previewElement ? renderElement(previewElement as Element, 0, site, page, true) : null}
    </PreviewFrame>
  );

  const codeview = (useWithRefs?: boolean) => (
    <div className={clsx("grid gap-4 pt-0", fullscreen ? "grid-cols-5" : "grid-cols-4")}>
      {viewMode !== 2 ? (
        <div className="col-span-1">
          <PageEditorSidebar editorRef={editorRef} monacoRef={monacoRef} />
        </div>
      ) : null}
      <div
        className={clsx(
          fullscreen
            ? viewMode < 2
              ? "col-span-4"
              : "col-span-5"
            : viewMode < 2
              ? "col-span-3"
              : "col-span-4"
        )}
      >
        <div className="sticky top-0 h-screen w-full border border-y-0 border-r-0">
          <Editor
            height="max(100%, 90vh)" // By default, it does not have a size
            defaultLanguage="html"
            defaultValue=""
            theme="stoneSwamp"
            value={page.content ?? ""}
            onChange={(value) => {
              onContentChange(value || "");
            }}
            beforeMount={handleBeforeMount}
            onMount={useWithRefs ? handleEditorDidMount : () => {}}
            options={{
              minimap: {
                enabled: false
              }
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {!fullscreen ? (
        <>
          <div className="mb-10">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="w-20 pb-2 align-middle">
                    <Label htmlFor="page-title">Title</Label>
                  </td>
                  <td className="pb-2">
                    <div className="lg:w-1/2">
                      <Input
                        id="page-title"
                        placeholder="New Page"
                        className={titleError ? "border-rose-500" : ""}
                        value={page?.title || ""}
                        onChange={(e) => onTitleChange(e.target.value)}
                      />
                      {titleError && <p className="text-sm text-rose-500">{titleError}</p>}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="w-20 py-2 align-middle">
                    <Label htmlFor="page-slug">Slug</Label>
                  </td>
                  <td className="py-2">
                    <div className="lg:w-1/2">
                      <Input
                        id="page-slug"
                        placeholder="new-page"
                        className={slugError ? "border-rose-500" : ""}
                        value={page?.slug || ""}
                        onChange={(e) => onSlugChange(e.target.value)}
                      />
                      {slugError && <p className="text-sm text-rose-500">{slugError}</p>}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="w-20 pt-2 align-middle">
                    <Label>Live Link</Label>
                  </td>
                  <td className="pt-2">
                    <Button variant="secondary" disabled={isDraft || !page.slug} asChild>
                      <Link href={linkWithSlug} target="_blank" className="align-bottom">
                        {linkWithSlug} ↗
                      </Link>
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : null}
      <div>
        <Tabs
          value={viewMode === 0 ? "preview" : viewMode === 1 ? "code" : "split"}
          onValueChange={(value) => {
            // Prevent switching to split view on mobile
            if (value === "split" && isMobile) {
              return;
            }
            setViewMode(value === "preview" ? 0 : value === "code" ? 1 : 2);
          }}
          className="rounded-lg border border-stone-200 bg-white"
        >
          <div className="sticky">
            <div
              className={
                "relative flex items-center justify-between border-b border-stone-200 bg-stone-50 p-1 pr-2 " +
                (fullscreen ? "z-10" : "rounded-t-lg")
              }
            >
              <Button size="icon" variant="ghost" onClick={() => setFullscreen(!fullscreen)}>
                {fullscreen ? (
                  <Minimize size={4} className="text-stone-500" />
                ) : (
                  <Maximize size={4} className="text-stone-500" />
                )}
              </Button>
              <TabsList
                variant="background"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent"
              >
                <TabsTrigger
                  variant="background"
                  value="preview"
                  className="flex items-center gap-1.5"
                >
                  <Eye />
                  Preview
                </TabsTrigger>
                <TabsTrigger
                  variant="background"
                  value="code"
                  className="flex items-center gap-1.5"
                >
                  <Code />
                  Code
                </TabsTrigger>
                {!isMobile && (
                  <TabsTrigger
                    variant="background"
                    value="split"
                    className="flex items-center gap-1.5"
                  >
                    <SquareSplitHorizontal />
                    Split
                  </TabsTrigger>
                )}
              </TabsList>

              {fullscreen && (
                <div className="flex gap-2">
                  {page.slug ? (
                    <Button variant="ghost" size="icon" tooltip="See live preview" asChild>
                      <Link href={linkWithSlug} target="_blank">
                        <SquareArrowOutUpRight />
                      </Link>
                    </Button>
                  ) : null}
                  <Button loading={inProgress} onClick={onSave} className="gap-0.5">
                    Save
                    <span className="translate-x-1 rounded border border-white/[12%] bg-white/[6%] px-1 py-0.5 text-[10px]/3 font-semibold">
                      ⌘S
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          <TabsContent
            value="preview"
            className={cn(
              "mt-0",
              !fullscreen &&
                "h-[calc(100vh-48px-var(--header-height))] overflow-y-auto md:h-[calc(100vh-80px-var(--header-height))]"
            )}
          >
            {preview}
          </TabsContent>
          <TabsContent
            value="code"
            className={cn(
              "mt-0",
              !fullscreen &&
                "h-[calc(100vh-48px-var(--header-height))] overflow-y-auto md:h-[calc(100vh-80px-var(--header-height))]"
            )}
          >
            {codeview(true)}
          </TabsContent>
          <TabsContent
            value="split"
            className={cn(
              "mt-0",
              !fullscreen &&
                "h-[calc(100vh-48px-var(--header-height))] md:h-[calc(100vh-80px-var(--header-height))]"
            )}
          >
            <ResizablePanelGroup 
              direction="horizontal"
              className="h-full"
            >
              <ResizablePanel defaultSize={50} minSize={20}>
                <div className="h-full overflow-hidden">
                  {preview}
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50} minSize={20}>
                <Editor
                  height="100%"
                  defaultLanguage="html"
                  defaultValue=""
                  theme="stoneSwamp"
                  value={page.content ?? ""}
                  onChange={(value) => {
                    onContentChange(value || "");
                  }}
                  beforeMount={handleBeforeMount}
                  options={{
                    minimap: {
                      enabled: false
                    }
                  }}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
