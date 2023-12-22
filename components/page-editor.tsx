'use client'

import Editor from "@monaco-editor/react";
import { Box, Text, TextField, Checkbox } from "@radix-ui/themes";
import { Button, Bold, TextInput } from "@tremor/react";
import { EyeOpenIcon, CodeIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useState } from "react";
import { updatePage, deletePage } from "@/lib/actions";
import componentsMap from "./site/insertables";
import renderElement from "./site/page-renderer";
import { set } from "date-fns";
import { useRouter } from 'next/navigation'
import { is } from "date-fns/locale";


import {  Flex, Grid, Col, Badge, Callout } from "@tremor/react";
import DashboardCard from "./common/dashboard-card";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";

function TimedAlert({message, timeout = 0, color = 'info', refresh} : {message: string, timeout?: number, color?: string, refresh: boolean}) {
    
    const [showAlert, setShowAlert] = useState<boolean>(true);

    useEffect(() => {
        setShowAlert(true);
        if( timeout === 0 ) return;

        const timer = setTimeout(() => {
            setShowAlert(false);
        }, timeout);

        return () => clearTimeout(timer);
    }, [refresh]);


    return (
        <>
            {showAlert ? 
            <>
            <Callout
            title={message}
            icon={InfoCircledIcon}
          >
          </Callout>
            </>
            
            : 
            null }
        </>
    )
}

export default function PageEditor({site, page, homepageId, subdomain } : {site: any, page: any, homepageId: string | null, subdomain: string | null}) : JSX.Element {
    
    // const [content, setContent] = useState(page.content ?? '');
    const isHome = page.id === homepageId;

    const [data, setData] = useState<any>(page);

    const [slugVirgin, setSlugVirgin] = useState<boolean>(true);

    const [editorRef, setEditorRef] = useState<any>(null);

    const [inProgress, setInprogress] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const [status, setStatus] = useState<any>({message: '', type: 'info'});

    const [isPreview, setIsPreview] = useState<boolean>(true);

    const [previewElement, setPreviewElement] = useState<any>(null);
    const [forceStatusRefresh, setForceStatusRefresh] = useState<boolean>(false);

    const [willBeHome, setWillBeHome] = useState<boolean>(isHome);
    const [isCurrentlyHome, setIsCurrentlyHome] = useState<boolean>(isHome);

    const [titleError, setTitleError] = useState<string | null>(null);
    const [slugError, setSlugError] = useState<string | null>(null);

    const router = useRouter();

    function handleEditorDidMount(editor : any, monaco : any) {
        setEditorRef(editor);
    }

    const insertAtCursor = useCallback((textToInsert : string) => {
        if(!editorRef) return;

        const selection = editorRef.getSelection();
        const id = { major: 1, minor: 1 };             
        const op = {identifier: id, range: selection, text: textToInsert, forceMoveMarkers: true};
        editorRef.executeEdits("my-source", [op]);
       
    }, [editorRef]);


    useEffect(() => {
        
        if(!slugVirgin) return;
        if(!data.title) return;
        if(data.slug) return;

        const slug = data.title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        setData({...data, slug});

    }, [data.title])

    useEffect(() => {
      
        if(!page.content) setIsPreview(false);
    
    }, [page.content])

    useEffect(() => {
        if(isPreview) {
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data.content, 'text/html');
                const rootElement = doc.body.children;
                setPreviewElement(Array.from(rootElement));
            } catch (error) {
                console.log(error);
            }
        } else {
            setPreviewElement(null);
        }
    }, [isPreview])

    const validate = () => {
        let isValid = true;

        // Validate title
        if (!data.title || data.title.trim() === '') {
            setTitleError("Title is required.");
            isValid = false;
        } else {
            setTitleError(null);
        }

        // Validate slug (example validation, adjust as needed)
        if (!data.slug || data.slug.trim() === '') {
            setSlugError("Slug is required.");
            isValid = false;
        } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
            setSlugError("Slug is not valid. Only lowercase alphanumeric characters and hyphens are allowed.");
            isValid = false;
        } else {
            setSlugError(null);
        }

        return isValid;
    };


    const saveContent = async () => {
        
        if (!validate() || inProgress) return;

        setInprogress(true);
        try {
            await updatePage(data, willBeHome, isCurrentlyHome);
            setIsCurrentlyHome(willBeHome);
            
            setStatus({message: 'The page was succesfully saved', timeout: 3000});
        } catch (error) {
            setStatus({message: 'An error occured while saving the page', color: 'error', timeout: 3000});
        } finally {   
            setForceStatusRefresh(!forceStatusRefresh);
        }
        

        setInprogress(false);
    };

    const doDeletePage = async () => {
        if(inProgress) return;
        setIsDeleting(true);
        try {
            const result = await deletePage( page ) as any;
            
            if(result.error) {
                setStatus({message: result.error, color: 'red', timeout: 3000});
            } else {
                setStatus({message: 'The page was succesfully deleted', timeout: 3000});
                router.push(`/site/${site.id}`);
            }
        } catch (error) {
            setStatus({message: 'An error occured while deleting the page', color: 'red', timeout: 3000});
        } finally {
            setForceStatusRefresh(!forceStatusRefresh);
        }
        setIsDeleting(false);
    }

    const saveButton = (<Button 
        size="xs"
        className="w-full"
        disabled={inProgress}
        loading={inProgress}
        onClick={saveContent}
        >Save</Button>)

    const deleteButton =(<Button
        className="w-full"
        size="xs"
        disabled={inProgress || isDeleting}
        loading={isDeleting}
        onClick={doDeletePage}
        >Delete</Button>)

    const unpublishButton = (
        <Button
            className="w-full"
            size="xs"
            disabled={inProgress || isDeleting}
            onClick={() => {
                setData({...data, draft: !data.draft});
                saveContent();
            }}
        >
            {data.draft ? 'Publish' : 'Unpublish'}
        </Button>
    );
    
    let previewLink = null;
    if(subdomain) {
        const url = `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
        
        previewLink = (
            <Flex>
            <a
                href={
                process.env.NEXT_PUBLIC_VERCEL_ENV
                    ? `https://${url}` + (page.id === homepageId ? '' : `/${page.slug}`)
                    : `http://${subdomain}.localhost:3000` + (page.id === homepageId ? '' : `/${page.slug}`)
                }
                target="_blank"
                rel="noreferrer"
                className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200"
            >
                {url + (page.id === homepageId ? '' : `/${page.slug}`)} ↗
            </a>
            </Flex>
        )
    }

    const PREVIEW_INDEX = 0;
    const CODE_INDEX = 1;
    const lastUpdateDate = new Date(data.updatedAt).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
    
    return (
        <>
            <Grid numItems={12} className="gap-2">
                <Col numColSpanMd={9}>

                <Grid numItems={12} className="gap-2 mb-4">
                    <Col numColSpanMd={8}>
                        <Bold>Page Title</Bold>
                        <TextInput
                            placeholder="Title"
                            error={titleError? true : false}
                            errorMessage={titleError ? titleError : ""}
                            defaultValue={data?.title || ""}
                            onChange={(e) => {
                                setTitleError(null);
                                setData({ ...data, title: e.target.value })
                            }}
                        >
                        </TextInput>
                    </Col>

                    <Col numColSpanMd={4}>
                        
                        <Flex>
                            <Bold>URL</Bold>          
                        </Flex>

                        <Flex>
                        <TextInput
                            placeholder="Path"
                            error={slugError? true : false}
                            errorMessage={slugError ? slugError : ""}
                            defaultValue={data?.slug || ""}
                            onChange={(e) => {
                                setSlugError(null);
                                setSlugVirgin(false);
                                setData({ ...data, slug: e.target.value })
                            }}
                        >
                            </TextInput>
                        </Flex>
                    </Col>


                </Grid>

                <Flex className="mb-2" justifyContent="between">
                    <Box>
                        <Bold>Page Content</Bold>
                    </Box>
                    <Box>
                        {previewLink}
                    </Box>
                </Flex>


                    <DashboardCard>
                        
                    <TabGroup defaultIndex={PREVIEW_INDEX} onIndexChange={(index) => setIsPreview(index === PREVIEW_INDEX)}>
                        <TabList variant="solid" className="font-bold">
                            <Tab className={isPreview? "bg-white" : ""} icon={EyeOpenIcon}>Preview</Tab>
                            <Tab className={isPreview? "" : "bg-white"} icon={CodeIcon}>Code</Tab>
                        </TabList>
                        <TabPanels>
                        <TabPanel>
                            {previewElement ? renderElement(previewElement as Element, 0, site, page, true) : null}
                        </TabPanel>
                        <TabPanel>
                            Custom Components:
                                { Object.values(componentsMap).map((component: any, index: number) => {
                                    return (
                                        <Button key={index} size="xs" color="gray" onClick={() => insertAtCursor(`<${component.tag}></${component.tag}>`)}>{component.name}</Button>
                                    )
                                })}
                            <Editor
                                height="90vh" // By default, it does not have a size
                                defaultLanguage="html"
                                defaultValue=""
                                theme="vs-dark"
                                value={data.content}
                                onChange={(value) => setData((data : any) => ({ ...data, content: value}))}
                                onMount={handleEditorDidMount}
                                options={{
                                    minimap: {
                                      enabled: false,
                                    },
                                  }} />
                        </TabPanel>
                        </TabPanels>
                    </TabGroup>
                    </DashboardCard>
                </Col>

                <Col numColSpanMd={3}>
                    <DashboardCard>
                        <Box>
                            <Text>This page is currently</Text>                                     
                            {data.draft ?
                                <> in <Badge color="gray" size="xs">Draft</Badge> </> :
								<> <Badge color="green" size="xs">Live</Badge> </>}
                                and was last updated on {lastUpdateDate}.
                            </Box>
                    </DashboardCard>
                    
                    { status.message ? <TimedAlert {...status} refresh={forceStatusRefresh} /> : null }

                    <DashboardCard>
                        <Box mb="2">
                        {saveButton}
                        </Box>
                        <Box mb="2">
                            {unpublishButton}
                        </Box>
                        <Box mb="2">
                            {deleteButton}
                        </Box>

                    </DashboardCard>
                </Col>
            </Grid>
        </>
    )
}