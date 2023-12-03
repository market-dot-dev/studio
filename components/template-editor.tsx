'use client'

import Editor from "@monaco-editor/react";
import { Button, Flex, Box } from "@radix-ui/themes";
import { useCallback, useEffect, useState } from "react";
import componentsMap from "./site";



export default function TemplateEditor({siteId, content: initialContent} : {siteId: string, content: string}) : JSX.Element {
    const [content, setContent] = useState(initialContent);

    const [editorRef, setEditorRef] = useState(null);

    function handleEditorDidMount(editor : any, monaco : any) {
        setEditorRef(editor);
    }

    const insertAtCursor = useCallback((textToInsert : string) => {
        if(!editorRef) return;

        console.log(editorRef);
       
    }, [editorRef]);

    useEffect(() => {
      
        setContent(initialContent);
    
    }, [initialContent])

    const saveContent = async () => {
      try {
        // await axios.post('/api/savePage', { content, siteId });
        await fetch('/api/savepage', {
            method: 'POST',
            body: JSON.stringify({ content, siteId }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('saved');
        
      } catch (error) {
        // Handle error
      }
    };
    return (
        <>
            <Flex justify="between">
                <Box>
                    { Object.values(componentsMap).map((component: any, index: number) => {
                        return (
                            <Button key={index} onClick={() => insertAtCursor(`<${component.tag}></${component.tag}>`)}>{component.name}</Button>
                        )
                    })}
                </Box>
                <Box>
                    <Button onClick={saveContent}>Save</Button>
                </Box>
            </Flex>
            <Editor
                height="90vh" // By default, it does not have a size
                defaultLanguage="javascript"
                defaultValue="// some comment"
                theme="vs-dark"
                value={content}
                onChange={(value) => setContent(value ?? '')}
                options={{ language: 'javascript' }}
                onMount={handleEditorDidMount}
            />
        </>
    )
}