"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { Eye, Code, SquareSplitHorizontal, Maximize, Minimize } from "lucide-react";
import clsx from "clsx";
import { toast } from "sonner";

import renderElement from "./page-renderer";

import { Button } from "@/components/ui/button";
import { Page, Site } from "@prisma/client";
import PageEditorSidebar from "./page-editor-sidebar";
import { useFullscreen } from "../dashboard/dashboard-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageEditorProps {
  site: Partial<Site>;
  page: Partial<Page> & {
    content?: string | null;
    slug?: string | null;
    title?: string | null;
  };
  homepageId: string | null;
  siteUrl: string | null;
  hasActiveFeatures?: boolean;
  isDraft: boolean;
  titleError: string | null;
  slugError: string | null;
  slugVirgin: boolean;
  onTitleChange: (title: string) => void;
  onSlugChange: (slug: string) => void;
  onContentChange: (content: string) => void;
  onSave: () => Promise<void>;
  inProgress: boolean;
}

export default function PageEditor({
  site,
  page,
  homepageId,
  siteUrl,
  hasActiveFeatures,
  isDraft,
  titleError,
  slugError,
  slugVirgin,
  onTitleChange,
  onSlugChange,
  onContentChange,
  onSave,
  inProgress
}: PageEditorProps): JSX.Element {
  const isHome = page.id === homepageId;

  const [editorRef, setEditorRef] = useState<any>(null);
  const [monacoRef, setMonacoRef] = useState<any>(null);
  
  // 0: "preview",
  // 1: "code",
  // 2: "split",
  const [viewMode, setViewMode] = useState<number>(0);
  
  const [previewElement, setPreviewElement] = useState<any>(null);

  const {fullscreen, setFullscreen} = useFullscreen();
  
  function handleEditorDidMount(editor: any, monaco: any) {
    setMonacoRef(monaco);
    setEditorRef(editor);
  }

  const generatePreview = useCallback(() => {
    try {
      const parser = new DOMParser();
      const content = typeof page?.content === 'string' ? page.content : '';
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

  const linkWithSlug = siteUrl ? siteUrl + (isHome ? '' : page.slug || '') : '';

  const preview = (<PreviewFrame>
    {previewElement
      ? (
        renderElement(
          previewElement as Element,
          0,
          site,
          page,
          true,
          hasActiveFeatures
        )
      ) : null}
  </PreviewFrame>
  )

  const codeview = (useWithRefs?: boolean) => (
    <div
      className={clsx(
        "grid gap-4 pt-0",
        fullscreen ? "grid-cols-5" : "grid-cols-4",
      )}
    >
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
              : "col-span-4",
        )}
      >
        <div className="sticky top-0 h-[100vh] w-full border border-y-0 border-r-0">
          <Editor
            height="max(100%, 90vh)" // By default, it does not have a size
            defaultLanguage="html"
            defaultValue=""
            theme="night-dark"
            value={page.content ?? ""}
            onChange={(value) => {
              onContentChange(value || "");
            }}
            onMount={useWithRefs ? handleEditorDidMount : () => {}}
            options={{
              minimap: {
                enabled: false,
              },
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
                      {titleError && (
                        <p className="text-sm text-rose-500">{titleError}</p>
                      )}
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
                      {slugError && (
                        <p className="text-sm text-rose-500">{slugError}</p>
                      )}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="w-20 pt-2 align-middle">
                    <Label>Live Link</Label>
                  </td>
                  <td className="pt-2">
                    <Button
                      variant="secondary"
                      disabled={isDraft || !page.slug}
                      asChild
                    >
                      <Link
                        href={linkWithSlug}
                        target="_blank"
                        className="align-bottom"
                      >
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
          defaultValue={
            viewMode === 0 ? "preview" : viewMode === 1 ? "code" : "split"
          }
          onValueChange={(value) => {
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
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setFullscreen(!fullscreen)}
              >
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
                <TabsTrigger
                  variant="background"
                  value="split"
                  className="flex items-center gap-1.5"
                >
                  <SquareSplitHorizontal />
                  Split
                </TabsTrigger>
              </TabsList>

              {fullscreen && (
                <div className="flex gap-2">
                  {page.slug ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      tooltip="See live preview"
                      asChild
                    >
                      <Link href={linkWithSlug} target="_blank">
                        <Eye />
                      </Link>
                    </Button>
                  ) : null}
                  <Button
                    loading={inProgress}
                    onClick={onSave}
                    className="gap-1 pr-2"
                  >
                    Save
                    <span className="text-[10px]/3 font-semibold border border-white/[12%] py-0.5 px-1 rounded bg-white/[6%]">⌘S</span>
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
                "h-[calc(100vh-48px-var(--headerHeight))] overflow-y-auto md:h-[calc(100vh-80px-var(--headerHeight))]",
            )}
          >
            {preview}
          </TabsContent>
          <TabsContent
            value="code"
            className={cn(
              "mt-0",
              !fullscreen &&
                "h-[calc(100vh-48px-var(--headerHeight))] overflow-y-auto md:h-[calc(100vh-80px-var(--headerHeight))]",
            )}
          >
            {codeview(true)}
          </TabsContent>
          <TabsContent
            value="split"
            className={cn(
              "mt-0",
              !fullscreen &&
                "h-[calc(100vh-48px-var(--headerHeight))] overflow-y-auto md:h-[calc(100vh-80px-var(--headerHeight))]",
            )}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">{preview}</div>
              <div className="col-span-1">
                <Editor
                  height="max(100vh, 90vh)"
                  defaultLanguage="html"
                  defaultValue=""
                  theme="night-dark"
                  value={page.content ?? ""}
                  onChange={(value) => {
                    onContentChange(value || "");
                  }}
                  options={{
                    minimap: {
                      enabled: false,
                    },
                  }}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function PreviewFrame({ children }: { children: React.ReactNode }) {
  const wrappingDiv = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const observerRef = useRef<ResizeObserver | null>(null);
  
  useEffect(() => {
    if (!wrappingDiv.current) return;

    const updateScale = () => {
      if (wrappingDiv.current) {
        const frame = wrappingDiv.current;
        const width = frame.clientWidth;
        setScale(width / 1600);
      }
    };

    // Initialize ResizeObserver
    observerRef.current = new ResizeObserver((entries) => {
      // We only have one element being observed
      if (entries.length > 0) {
        updateScale();
      }
    });

    // Start observing the wrapping div
    observerRef.current.observe(wrappingDiv.current);

    // Initial scale update
    updateScale();

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Also update scale when children change (content updates)
  useEffect(() => {
    if (wrappingDiv.current) {
      const width = wrappingDiv.current.clientWidth;
      setScale(width / 1600);
    }
  }, [children]);

  return (
    <div className="w-full overflow-x-hidden" ref={wrappingDiv}>
      <div
        className="w-[1600px]"
        style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        {children}
      </div>
    </div>
  );
}