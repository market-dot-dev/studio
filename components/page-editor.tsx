'use client'

import Editor from "@monaco-editor/react";
import { Flex, Box, Text, TextField, Checkbox } from "@radix-ui/themes";
import { Button, Alert } from 'flowbite-react';
import { EyeOpenIcon, CodeIcon, CheckIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useState } from "react";
import { updatePage, deletePage } from "@/lib/actions";
import componentsMap from "./site";
import renderElement from "./site/page-renderer";
import { set } from "date-fns";
import { useRouter } from 'next/navigation'
import { is } from "date-fns/locale";


function TimedAlert({message, timeout = 0, color = 'info', refresh} : {message: string, timeout?: number, color?: string, refresh: boolean}) {
    
    const [show, setShow] = useState<boolean>(true);

    useEffect(() => {
        setShow(true);
        if( timeout === 0 ) return;

        const timer = setTimeout(() => {
            setShow(false);
        }, timeout);

        return () => clearTimeout(timer);
    }, [refresh]);


    return (
        <>
            {show ? <Alert color={color} onDismiss={() => setShow(false)}>
                <span>{message}</span>
            </Alert> : null}
        </>
    )
}

export default function PageEditor({siteId, page, homepageId, subdomain } : {siteId: string, page: any, homepageId: string | null, subdomain: string | null}) : JSX.Element {
    
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
                router.push(`/site/${siteId}`);
            }
        } catch (error) {
            setStatus({message: 'An error occured while deleting the page', color: 'red', timeout: 3000});
        } finally {
            setForceStatusRefresh(!forceStatusRefresh);
        }
        setIsDeleting(false);
    }

    const saveButton = (<Button 
        disabled={inProgress}
        isProcessing={inProgress}
        onClick={saveContent}
        >Save</Button>)

    const deleteButton =(<Button
        disabled={inProgress || isDeleting}
        isProcessing={isDeleting}
        color="red"
        onClick={doDeletePage}
        >Delete</Button>)
    
    let previewLink = null;
    if(subdomain) {
        const url = `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
        
        previewLink = (
            <>
                { page.draft ? (
                    <span className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700">
                        Draft
                    </span>
                ) : (
                    <a
                        href={
                        process.env.NEXT_PUBLIC_VERCEL_ENV
                            ? `https://${url}` + (page.id === homepageId ? '' : `/${page.slug}`)
                            : `http://${subdomain}.localhost:3000` + (page.id === homepageId ? '' : `/${page.slug}`)
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
                    >
                        {url + (page.id === homepageId ? '' : `/${page.slug}`)} ↗
                    </a>
                )}
            </>
        )
    }
    
    return (
        <>
            { status.message ? <TimedAlert {...status} refresh={forceStatusRefresh} /> : null }
            
            { isPreview ?
                <>
                    <Flex justify="between">
                        <Box>{previewLink}</Box>
                        <Box>{deleteButton}</Box>
                        <Box>
                            <Button.Group outline>
                                <Button onClick={() => setIsPreview(false)}>
                                    <Flex gap="2" align='center'>
                                        <Text>Edit</Text>
                                        <CodeIcon />
                                    </Flex>
                                </Button>
                                {saveButton}
                            </Button.Group>
                        </Box>
                    </Flex>
                    {previewElement ? renderElement(previewElement as Element, 0) : null}
                </>
            : 
            <>
                <Flex justify="between">
                    <Box>{previewLink}</Box>
                    <Box>{deleteButton}</Box>
                    <Box>
                        <Button.Group outline>
                            
                            <Button onClick={() => setIsPreview(true)} disabled={!data.content} >
                                <Flex gap="2" align='center'>
                                    <Text>Preview</Text>
                                    <EyeOpenIcon />
                                </Flex>
                            </Button>
                                
                            {saveButton}
                        </Button.Group>
                    </Box>
                </Flex>
                <Flex direction="column" gap="2">
                    <input
                        type="text"
                        placeholder="Title"
                        defaultValue={data?.title || ""}
                        autoFocus
                        onChange={(e) => {
                            setTitleError(null);
                            setData({ ...data, title: e.target.value })
                        }}
                        className="dark:placeholder-text-600 border-none px-0 font-cal text-3xl placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:bg-black dark:text-white"
                        />
                    {titleError && <Text color="red" size="1">{titleError}</Text>}
                </Flex>
                <Flex justify='between' gap="6" align="center">
                    <Box grow="1">
                        <Flex direction="column" gap="2">
                            <TextField.Root>
                                <TextField.Input 
                                    placeholder="Page slug" 
                                    defaultValue={data?.slug || ""}
                                    onChange={(e) => {
                                        setSlugError(null);
                                        setSlugVirgin(false);
                                        setData({ ...data, slug: e.target.value })
                                    }}
                                    // Additional TextField props as needed
                                />
                            </TextField.Root>
                            {slugError && <Text color="red" size="1">{slugError}</Text>}
                        </Flex>
                    </Box>
                    <Box style={{ maxWidth: 300 }}>
                        <Text as="label" size="2">
                            <Flex gap="2" align="center">
                                <input type="checkbox" checked={data.draft} onChange={(e) => {
                                    setData({ ...data, draft: e.target.checked })
                                }} /> Draft.
                            </Flex>
                        </Text>
                    </Box>
                    <Box style={{ maxWidth: 300 }}>
                        <Text as="label" size="2">
                            <Flex gap="2" align="center">
                                { isCurrentlyHome ? <CheckIcon /> : 
                                <input type="checkbox" checked={willBeHome} onChange={(e) => {
                                    setWillBeHome(e.target.checked)
                                }} /> } Set as homepage.
                            </Flex>
                        </Text>
                    </Box>
                </Flex>
                <Button.Group>
                        { Object.values(componentsMap).map((component: any, index: number) => {
                            return (
                                <Button key={index} size="xs" color="gray" onClick={() => insertAtCursor(`<${component.tag}></${component.tag}>`)}>{component.name}</Button>
                            )
                        })}
                    </Button.Group>
                <Editor
                    height="90vh" // By default, it does not have a size
                    defaultLanguage="html"
                    defaultValue=""
                    theme="vs-dark"
                    value={data.content}
                    onChange={(value) => setData((data : any) => ({ ...data, content: value}))}
                    onMount={handleEditorDidMount}
                />
            </>
            }
        </>
    )
}