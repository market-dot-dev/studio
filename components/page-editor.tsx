"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { Box, Text } from "@radix-ui/themes";
import { EyeOpenIcon, CodeIcon, InfoCircledIcon } from "@radix-ui/react-icons";

import renderElement from "./site/page-renderer";
import { useRouter } from "next/navigation";

import { Flex, Grid, Col, Badge, Callout, Button, Bold, TextInput, Card } from "@tremor/react";
import DashboardCard from "./common/dashboard-card";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";
import {
  setHomepage,
  deletePage,
  updatePage,
} from "@/app/services/PageService";
import { Page, Site } from "@prisma/client";
import PageEditorSidebar from "./site/page-editor-sidebar";

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
}: {
  site: Partial<Site>;
  page: Partial<Page>;
  homepageId: string | null;
  siteUrl: string | null;
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

  const [isPreview, setIsPreview] = useState<boolean>(true);

  const [previewElement, setPreviewElement] = useState<any>(null);
  const [forceStatusRefresh, setForceStatusRefresh] = useState<boolean>(false);

  const [willBeHome, setWillBeHome] = useState<boolean>(isHome);
  const [isCurrentlyHome, setIsCurrentlyHome] = useState<boolean>(isHome);

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
    };

    document.addEventListener("keydown", handleSaveShortcut);

    return () => {
      document.removeEventListener("keydown", handleSaveShortcut);
    };
  }, [data])

  useEffect(() => {
    if (isPreview) {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.content, "text/html");
        const rootElement = doc.body.children;
        setPreviewElement(Array.from(rootElement));
      } catch (error) {
        console.log(error);
      }
    } else {
      setPreviewElement(null);
    }
  }, [isPreview]);

  // trigger auto save on content change
  useEffect(() => {
    // do not attempt auto save if the title and slug of the page are not set
    if (data?.content && data?.title && data?.slug) {
      debouncedSaveChanges();
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

  const saveButton = (
    <Button
      size="xs"
      className="w-full"
      disabled={inProgress}
      loading={inProgress}
      loadingText="Saving..."
      onClick={() => saveContent(page)}
    >
      Save
    </Button>
  );

  const deleteButton = (
    <Button
      className="w-full bg-red-500 hover:bg-red-600 border-red-600"
      size="xs"
      disabled={inProgress || isDeleting || isHome}
      loading={isDeleting}
      tooltip={isHome ? "Cannot delete the homepage" : ""}
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
      className="w-full"
      size="xs"
      disabled={inProgress || isMakingHomepage || isHome}
      loading={isDeleting}
      tooltip={isHome ? "This page is already the homepage" : ""}
      
      onClick={doMakeHomepage}
    >
      Make Homepage
    </Button>
  );

  const linkWithSlug = siteUrl + ( isHome ? '' : data.slug )
  
  const previewLink = (
      <Flex className={ data.draft ? 'pointer-events-none opacity-50' : '' }>
        <a
          href={ linkWithSlug }
          target="_blank"
          rel="noreferrer"
          className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200"
        >
          {linkWithSlug} ↗
        </a>
      </Flex>
    );
  

  const PREVIEW_INDEX = 0;
  const CODE_INDEX = 1;
  const lastUpdateDate = new Date(data.updatedAt).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <>
      <Grid numItems={12} className="gap-2">
        <Col numColSpanMd={9}>
          <Grid numItems={12} className="mb-4 gap-2">
            <Col numColSpanMd={8}>
              <Bold>Page Title</Bold>
              <TextInput
                placeholder="Title"
                error={titleError ? true : false}
                errorMessage={titleError ? titleError : ""}
                defaultValue={data?.title || ""}
                onChange={(e) => {
                  setTitleError(null);
                  setData({ ...data, title: e.target.value });
                }}
              ></TextInput>
            </Col>

            <Col numColSpanMd={4}>
              <Flex>
                <Bold>URL Slug</Bold>
              </Flex>

              <Flex>
                <TextInput
                  placeholder="Path"
                  error={slugError ? true : false}
                  errorMessage={slugError ? slugError : ""}
                  defaultValue={data?.slug || ""}
                  onChange={(e) => {
                    setSlugError(null);
                    setSlugVirgin(false);
                    setData({ ...data, slug: e.target.value });
                  }}
                ></TextInput>
              </Flex>
            </Col>
          </Grid>

          <Flex className="mb-2" justifyContent="between">
            <Box>
              <Bold>Page Content</Bold>
            </Box>
            <Box>{ data.slug ? previewLink : null}</Box>
          </Flex>

          <Flex className="mb-2" justifyContent="between">
            <Box>
              <Bold>Page Status</Bold>
            </Box>
            <Box>
              <DraftSelectBox
                inProgress={inProgress}
                isDeleting={isDeleting}
                draft={data.draft}
                handleChange={async (draft) => {
                  setData({ ...data, draft });
                  await updatePage(data.id, { draft });
                }}
              />
            </Box>
          </Flex>

        </Col>

        <Col numColSpanMd={3}>
          <DashboardCard>
            <Box>
              <Text>This page is currently</Text>
              {data.draft ? (
                <>
                  {" "}
                  in{" "}
                  <Badge color="gray" size="xs">
                    Draft
                  </Badge>{" "}
                </>
              ) : (
                <>
                  {" "}
                  <Badge color="green" size="xs">
                    Live
                  </Badge>{" "}
                </>
              )}
              and was last updated on {lastUpdateDate}.
            </Box>
          </DashboardCard>

          {status.message ? (
            <TimedAlert {...status} refresh={forceStatusRefresh} />
          ) : null}

          <DashboardCard>
            <Box mb="2">{saveButton}</Box>
            <Flex className='gap-2'>
              <Box mb="2" className='grow'>{makeHomepageButton}</Box>
              <Box mb="2">{deleteButton}</Box>
            </Flex>
          </DashboardCard>
        </Col>
        <Col numColSpanMd={12}>
        <Card className="p-0">
            <TabGroup
              defaultIndex={PREVIEW_INDEX}
              onIndexChange={(index) => setIsPreview(index === PREVIEW_INDEX)}
            >
              <div className="p-4 border border-x-0 border-t-0">
                <TabList variant="solid" className="font-bold">
                  <Tab className={isPreview ? "bg-white" : ""} icon={EyeOpenIcon}>
                    Preview
                  </Tab>
                  <Tab className={isPreview ? "" : "bg-white"} icon={CodeIcon}>
                    Code
                  </Tab>
                </TabList>
              </div>
              <TabPanels>
                <TabPanel>
                  <PreviewFrame>
                    {previewElement
                      ? 
                      renderElement(
                            previewElement as Element,
                            0,
                            site,
                            page,
                            true,
                          )
                      : null}
                  </PreviewFrame>
                </TabPanel>
                <TabPanel className="mt-0">
                  <Grid numItems={4} className="gap-4 pt-0">
                    <Col numColSpan={1}>
                      <PageEditorSidebar editorRef={editorRef} monacoRef={monacoRef} />
                    </Col>
                    <Col numColSpan={3}>
                      <div className="w-full sticky top-0 h-[100vh]">
                        <Editor                        
                          height="max(100%, 90vh)" // By default, it does not have a size
                          defaultLanguage="html"
                          defaultValue=""
                          theme="vs-dark"
                          value={data.content}
                          onChange={(value) =>
                            setData((data: any) => ({ ...data, content: value }))
                          }
                          onMount={handleEditorDidMount}
                          options={{
                            minimap: {
                              enabled: false,
                            },
                          }}
                        />
                      </div>
                    </Col>
                  </Grid>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </Card>
        </Col>
      </Grid>
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
      setScale(width / 1600)
    }
  }, [children]);

  return (
    <div className="w-full overflow-x-hidden" ref={wrappingDiv}>
      <div className="w-[1600px]" style={{transform: `scale(${scale})`, transformOrigin: 'top left'}}>
        {children}
      </div>
    </div>
  );
}