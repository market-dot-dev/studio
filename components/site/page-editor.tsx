"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { Box } from "@radix-ui/themes";
import { EyeOpenIcon, CodeIcon, InfoCircledIcon, BorderSplitIcon } from "@radix-ui/react-icons";
import clsx from "clsx";

import renderElement from "./page-renderer";
import { useRouter } from "next/navigation";

import {
  Callout,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@tremor/react";
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

let debounceTimeout: any;

function TimedAlert({
  message,
  timeout = 0,
  color = "info",
  refresh,
}: {
  message: string;
  timeout?: number;
  color?: string;
  refresh: boolean;
}) {
  const [showAlert, setShowAlert] = useState<boolean>(true);

  useEffect(() => {
    setShowAlert(true);
    if (timeout === 0) return;

    const timer = setTimeout(() => {
      setShowAlert(false);
    }, timeout);

    return () => clearTimeout(timer);
  }, [refresh]);

  return (
    <>
      {showAlert ? (
        <>
          <Callout title={message} icon={InfoCircledIcon}></Callout>
        </>
      ) : null}
    </>
  );
}
const SelectOption = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => {
  return <option value={value}>{children}</option>;
};

const SelectBox = ({
  value,
  children,
  inProgress,
  isDeleting,
  handleChange,
}: {
  value: string;
  children: React.ReactNode;
  inProgress: boolean;
  isDeleting: boolean;
  handleChange?: (value: boolean) => void;
}) => {
  return (
    <div className="flex max-w-sm items-center overflow-hidden rounded-lg border border-stone-600">
      <select
        name="font"
        value={value}
        className="w-full rounded-none border-none bg-white px-4 py-2 text-sm font-medium text-stone-700 focus:outline-none focus:ring-black dark:bg-black dark:text-stone-200 dark:focus:ring-white"
        onChange={(e) => {
          return handleChange && handleChange(e.target.value === "true");
        }}
        disabled={inProgress || isDeleting}
      >
        {children}
      </select>
    </div>
  );
};

const DraftSelectBox = ({
  inProgress,
  isDeleting,
  draft,
  handleChange,
}: {
  inProgress: boolean;
  isDeleting: boolean;
  draft: boolean;
  handleChange: (value: boolean) => void;
}) => {
  return (
    <SelectBox
      value={String(draft)} // Pass the current value
      inProgress={inProgress}
      isDeleting={isDeleting}
      handleChange={handleChange}
    >
      <option value="false">Live</option>
      <option value="true">Draft</option>
    </SelectBox>
  );
};



export default function PageEditor({
  site,
  page,
  homepageId,
  siteUrl,
  hasActiveFeatures
}: {
  site: Partial<Site>;
  page: Partial<Page>;
  homepageId: string | null;
  siteUrl: string | null;
  hasActiveFeatures?: boolean;
}): JSX.Element {
  const isHome = page.id === homepageId;

  const [data, setData] = useState<any>(page);

  const [slugVirgin, setSlugVirgin] = useState<boolean>(!data.slug);

  const [editorRef, setEditorRef] = useState<any>(null);
  const [monacoRef, setMonacoRef] = useState<any>(null);

  const [inProgress, setInprogress] = useState<boolean>(false);
  const [isMakingHomepage, setIsMakingHomepage] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [status, setStatus] = useState<any>({ message: "", type: "info" });

  // 0: "preview",
  // 1: "code",
  // 2: "split",
  const [viewMode, setViewMode] = useState<number>(0);
  

  const [previewElement, setPreviewElement] = useState<any>(null);
  const [forceStatusRefresh, setForceStatusRefresh] = useState<boolean>(false);

  const [willBeHome, setWillBeHome] = useState<boolean>(isHome);
  const [isCurrentlyHome, setIsCurrentlyHome] = useState<boolean>(isHome);

  const {fullscreen, setFullscreen} = useFullscreen();

  const [titleError, setTitleError] = useState<string | null>(null);
  const [slugError, setSlugError] = useState<string | null>(null);

  const router = useRouter();
  
  function handleEditorDidMount(editor: any, monaco: any) {
    setMonacoRef(monaco);
    setEditorRef(editor);
  }

  useEffect(() => {
    if (!slugVirgin) return;
    // if (!data.title) return;
    // if (data.slug) return;

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

  const saveContent = async (page: Partial<Page>) => {
    if (!validate() || inProgress || !page || !page?.id) return;

    setInprogress(true);

    const { title, slug, content } = data;

    try {
      await updatePage(page.id, { title, slug, content });
      // call the refreshOnboarding function if it exists
      if(window?.hasOwnProperty('refreshOnboarding')) {
        (window as any)['refreshOnboarding']();
      }
      // setStatus({ message: "The page was succesfully saved", timeout: 3000 });
    } catch (error) {
      console.log(error);
    } finally {
      setForceStatusRefresh(!forceStatusRefresh);
    }

    setInprogress(false);
  };

  const autoSaveChanges = useCallback(async () => {
    if (!data || !data?.id) return;
    console.log('Auto-saving page');
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

  const doDeletePage = async () => {
    if (inProgress || !page?.id) return;

    setIsDeleting(true);
    try {
      const result = (await deletePage(page.id)) as any;

      if (result.error) {
        setStatus({ message: result.error, color: "red", timeout: 3000 });
      } else {
        setStatus({
          message: "The page was succesfully deleted",
          timeout: 3000,
        });
        router.push(`/site/${site.id}`);
      }
    } catch (error) {
      console.log(error);
      setStatus({
        message: "An error occured while deleting the page",
        color: "red",
        timeout: 3000,
      });
    } finally {
      setForceStatusRefresh(!forceStatusRefresh);
    }
    setIsDeleting(false);
  };

  const saveButton = (className?: string) => (
    <Button
      className={className}
      loading={inProgress}
      loadingText="Saving"
      onClick={() => saveContent(page)}
    >
      Save
    </Button>
  );

  const deleteButton = (
    <Button
      variant="destructive"
      disabled={inProgress || isDeleting || isHome}
      loading={isDeleting}
      loadingText="Deleting"
      tooltip={isHome ? "Cannot delete the homepage" : undefined}
      onClick={() => {
        if (window.confirm("Are you sure you want to delete this page?")) {
          doDeletePage();
        }
      }}
    >
      Delete
    </Button>
  );

  const doMakeHomepage = async () => {
    if (inProgress || !page?.siteId || !page?.id) return;

    setIsMakingHomepage(true);

    try {
      const result = (await setHomepage(page.siteId, page.id)) as any;

      if (result.error) {
        setStatus({ message: result.error, color: "red", timeout: 3000 });
      } else {
        setStatus({
          message: "The page was promoted to homepage",
          timeout: 3000,
        });
        router.push(`/site/${site.id}`);
      }
    } catch (error) {
      console.log(error);
      setStatus({
        message: "An error occured while promoting the page",
        color: "red",
        timeout: 3000,
      });
    } finally {
      setForceStatusRefresh(!forceStatusRefresh);
    }
    setIsMakingHomepage(false);
  };

  const makeHomepageButton = (
    <Button
      disabled={inProgress || isMakingHomepage || isHome}
      loading={isDeleting}
      tooltip={isHome ? "This page is already the homepage" : undefined}
      className="w-full"
      onClick={doMakeHomepage}
    >
      Set to Homepage
    </Button>
  );

  const linkWithSlug = siteUrl + ( isHome ? '' : data.slug )
  
  const previewLink = (
      <div className={`flex ${data.draft ? 'pointer-events-none opacity-50' : ''}`}>
        <a
          href={ linkWithSlug }
          target="_blank"
          rel="noreferrer"
          className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200"
        >
          {linkWithSlug} ↗
        </a>
      </div>
    );
  

  const lastUpdateDate = new Date(data.updatedAt).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

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
    <div className="grid grid-cols-12 gap-2">
      {!fullscreen ? (
        <>
          <div className={clsx("md:col-span-9", fullscreen ? "p-4" : "")}>
            <div className="mb-4 grid grid-cols-12 gap-2">
              <div className="space-y-1.5 md:col-span-8">
                <Label htmlFor="page-title">Page Title</Label>
                <Input
                  id="page-title"
                  placeholder="Title"
                  className={titleError ? "border-red-500" : ""}
                  defaultValue={data?.title || ""}
                  onChange={(e) => {
                    setTitleError(null);
                    setData({ ...data, title: e.target.value });
                  }}
                />
                {titleError && (
                  <p className="text-sm text-red-500">{titleError}</p>
                )}
              </div>

              <div className="space-y-1.5 md:col-span-4">
                <Label htmlFor="page-slug">URL Slug</Label>
                <Input
                  id="page-slug"
                  placeholder="Path"
                  className={slugError ? "border-red-500" : ""}
                  defaultValue={data?.slug || ""}
                  onChange={(e) => {
                    setSlugError(null);
                    setSlugVirgin(false);
                    setData({ ...data, slug: e.target.value });
                  }}
                />
                {slugError && (
                  <p className="text-sm text-red-500">{slugError}</p>
                )}
              </div>
            </div>

            <div className="mb-2 flex justify-between">
              <Box>
                <Label>Page Content</Label>
              </Box>
              <Box>{data.slug ? previewLink : null}</Box>
            </div>

            <div className="mb-2 flex justify-between">
                <Label>Page Status</Label>
                <DraftSelectBox
                  inProgress={inProgress}
                  isDeleting={isDeleting}
                  draft={data.draft}
                  handleChange={async (draft) => {
                    setData({ ...data, draft });
                    await updatePage(data.id, { draft });
                  }}
                />
            </div>
          </div>

          <div className={clsx("md:col-span-3", fullscreen ? "p-4" : "")}>
            <Card className="mb-2 p-2">
              <Box className="text-sm">
                <span className="text-stone-500">This page is currently</span>
                {data.draft ? (
                  <>
                    {" "}
                    in{" "}
                    <Badge size="sm" variant="secondary">
                      Draft
                    </Badge>{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    <Badge size="sm" variant="success">
                      Live
                    </Badge>{" "}
                  </>
                )}
                <span className="text-stone-500">
                  and was last updated on {lastUpdateDate}.
                </span>
              </Box>
            </Card>

            {status.message ? (
              <TimedAlert {...status} refresh={forceStatusRefresh} />
            ) : null}

            <div>
              <Box mb="2">{saveButton("w-full")}</Box>
              <div className="flex gap-2">
                <Box mb="2" className="grow">
                  {makeHomepageButton}
                </Box>
                <Box mb="2">{deleteButton}</Box>
              </div>
            </div>
          </div>
        </>
      ) : null}
      <div className="md:col-span-12">
        <Card
          className={
            "p-0" + (fullscreen ? " rounded-none shadow-none ring-0" : "")
          }
        >
          <TabGroup
            defaultIndex={viewMode}
            onIndexChange={(index) => {
              setViewMode(index);
            }}
          >
            <div
              className={
                "flex items-center justify-between border border-x-0 p-4" +
                (fullscreen ? " z-10 bg-white py-2" : " border-t-0")
              }
            >
              <TabList variant="solid" className="font-bold">
                <Tab
                  className={viewMode === 0 ? "bg-white" : ""}
                  icon={EyeOpenIcon}
                >
                  Preview
                </Tab>
                <Tab
                  className={viewMode === 1 ? "bg-white" : ""}
                  icon={CodeIcon}
                >
                  Code
                </Tab>
                <Tab
                  className={viewMode === 2 ? "bg-white" : ""}
                  icon={BorderSplitIcon}
                >
                  Split
                </Tab>
              </TabList>

              {fullscreen ? (
                <div className="flex">{data.slug ? previewLink : null}</div>
              ) : (
                <></>
              )}

              <div className="flex gap-4">
                {fullscreen && saveButton()}
                <Button
                  variant="outline"
                  onClick={() => setFullscreen(!fullscreen)}
                >
                  {fullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                </Button>
              </div>
            </div>
            <TabPanels>
              <TabPanel>{preview}</TabPanel>
              <TabPanel className="mt-0">{codeview(true)}</TabPanel>
              <TabPanel className="mt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">{preview}</div>
                  <div className="col-span-1">
                    <div className="sticky top-0 h-[100vh] w-full">
                      {codeview(false)}
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </Card>
      </div>
    </div>
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