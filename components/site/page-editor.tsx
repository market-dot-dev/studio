"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { Info, Eye, Code, SquareSplitHorizontal, Maximize, Minimize } from "lucide-react";
import clsx from "clsx";
import { toast } from "sonner";

import renderElement from "./page-renderer";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  setHomepage,
  deletePage,
  updatePage,
} from "@/app/services/PageService";
import { Page, Site } from "@prisma/client";
import PageEditorSidebar from "./page-editor-sidebar";
import { useFullscreen } from "../dashboard/dashboard-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Link from "next/link";

let debounceTimeout: any;

export default function PageEditor({
  site,
  page,
  homepageId,
  siteUrl,
  hasActiveFeatures,
  onSave,
}: {
  site: Partial<Site>;
  page: Partial<Page>;
  homepageId: string | null;
  siteUrl: string | null;
  hasActiveFeatures?: boolean;
  onSave?: (pageData: Partial<Page>) => Promise<void>;
}): JSX.Element {
  const isHome = page.id === homepageId;

  const [data, setData] = useState<any>(page);

  const [slugVirgin, setSlugVirgin] = useState<boolean>(!data.slug);

  const [editorRef, setEditorRef] = useState<any>(null);
  const [monacoRef, setMonacoRef] = useState<any>(null);

  const [inProgress, setInprogress] = useState<boolean>(false);

  // 0: "preview",
  // 1: "code",
  // 2: "split",
  const [viewMode, setViewMode] = useState<number>(0);
  
  const [previewElement, setPreviewElement] = useState<any>(null);

  const {fullscreen, setFullscreen} = useFullscreen();

  const [titleError, setTitleError] = useState<string | null>(null);
  const [slugError, setSlugError] = useState<string | null>(null);

  const router = useRouter();
  
  // Handle component updates when parent props change
  useEffect(() => {
    setData(page);
  }, [page]);
  
  function handleEditorDidMount(editor: any, monaco: any) {
    setMonacoRef(monaco);
    setEditorRef(editor);
  }

  useEffect(() => {
    if (!slugVirgin) return;

    const slug = data.title ? data.title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^a-z0-9-]/g, "") : "";
    
      setData({ ...data, slug });
      setSlugError(null);

  }, [data.title]);


  useEffect(() => {
    const handleSaveShortcut = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key === "s"
      ) {
        e.preventDefault();
        clearTimeout(debounceTimeout);
        saveContent(data);
      }

      // if escape key is pressed, exit fullscreen
      if (e.key === "Escape") {
        setFullscreen(false);
      }
    };

    document.addEventListener("keydown", handleSaveShortcut);

    return () => {
      document.removeEventListener("keydown", handleSaveShortcut);
    };
  }, [data])

  const generatePreview = useCallback(() => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.content, "text/html");
      const rootElement = doc.body.children;
      setPreviewElement(Array.from(rootElement));
    } catch (error) {
      console.log(error);
    }
  }, [setPreviewElement, data.content]);

  useEffect(() => {
    if (viewMode === 0 || viewMode === 2) {
      generatePreview();
    } else {
      setPreviewElement(null);
    }
  }, [viewMode]);

  // trigger auto save on content change
  useEffect(() => {
    // do not attempt auto save if the title and slug of the page are not set
    if (data?.content && data?.title && data?.slug) {
      debouncedSaveChanges();
      debouncedGeneratePreview();
    }
  }, [data.content]);

  const validate = () => {
    let isValid = true;

    // Validate title
    if (!data.title || data.title.trim() === "") {
      setTitleError("Title is required.");
      isValid = false;
    } else {
      setTitleError(null);
    }

    // Validate slug (example validation, adjust as needed)
    if (!data.slug || data.slug.trim() === "") {
      setSlugError("Slug is required.");
      isValid = false;
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
      setSlugError(
        "Slug is not valid. Only lowercase alphanumeric characters and hyphens are allowed.",
      );
      isValid = false;
    } else {
      setSlugError(null);
    }

    return isValid;
  };

  const saveContent = async (pageData: Partial<Page>) => {
    if (!validate() || inProgress || !pageData || !pageData?.id) return;

    setInprogress(true);

    if (onSave) {
      try {
        await onSave(data);
        toast.success("Page saved successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to save page");
      } finally {
        setInprogress(false);
      }
      return;
    }

    setInprogress(false);
  };

  const autoSaveChanges = useCallback(async () => {
    if (!data || !data?.id) return;
    await saveContent(data); 
  }, [data]);

  const debouncedSaveChanges = useCallback(() => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(autoSaveChanges, 2000);
  }, [data]);

  const debouncedGeneratePreview = useCallback(() => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(generatePreview, 500);
  }, [data.content]);

  const linkWithSlug = siteUrl + ( isHome ? '' : data.slug );


  const preview = (<PreviewFrame>
    {previewElement
      ? 
      renderElement(
            previewElement as Element,
            0,
            site,
            page,
            true,
            hasActiveFeatures
          )
      : null}
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
            value={data.content}
            onChange={(value) =>
              setData((data: any) => ({ ...data, content: value }))
            }
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
                  <td className="w-20 align-middle pb-2">
                    <Label htmlFor="page-title">Title</Label>
                  </td>
                  <td className="pb-2">
                    <div className="lg:w-1/2">
                      <Input
                        id="page-title"
                        placeholder="New Page"
                        className={titleError ? "border-rose-500" : ""}
                        defaultValue={data?.title || ""}
                        onChange={(e) => {
                          setTitleError(null);
                          setData({ ...data, title: e.target.value });
                        }}
                      />
                      {titleError && (
                        <p className="text-sm text-rose-500">{titleError}</p>
                      )}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="w-20 align-middle py-2">
                    <Label htmlFor="page-slug">Slug</Label>
                  </td>
                  <td className="py-2">
                    <div className="lg:w-1/2">
                      <Input
                        id="page-slug"
                        placeholder="new-page" 
                        className={slugError ? "border-rose-500" : ""}
                        defaultValue={data?.slug || ""}
                        onChange={(e) => {
                          setSlugError(null);
                          setSlugVirgin(false);
                          setData({ ...data, slug: e.target.value });
                        }}
                      />
                      {slugError && (
                        <p className="text-sm text-rose-500">{slugError}</p>
                      )}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="w-20 align-middle pt-2">
                    <Label>Live Link</Label>
                  </td>
                  <td className="pt-2">
                    <Button
                      variant="secondary"
                      disabled={data.draft || !data.slug}
                      asChild
                    >
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
                variant="ghost"
                size="icon"
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
                  {data.slug ? (
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
                    onClick={() => saveContent(data)}
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>
          </div>

          <TabsContent value="preview" className="mt-0">
            {preview}
          </TabsContent>
          <TabsContent value="code" className="mt-0">
            {codeview(true)}
          </TabsContent>
          <TabsContent value="split" className="mt-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">{preview}</div>
              <div className="col-span-1">
                <div className="sticky top-0 h-[100vh] w-full">
                  {codeview(false)}
                </div>
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
  useEffect(() => {
    if (wrappingDiv.current) {
      const frame = wrappingDiv.current;
      const width = frame.clientWidth;
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