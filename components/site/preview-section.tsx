'use client'

import { useMemo } from "react";
import renderElement from "./page-renderer";

export default function PreviewSection({ content, width=400, height, screenWidth = 1600, screenHeight = 800, className }: {content: string, width?: number, height?:number, screenWidth?: number, screenHeight?: number, className?: string}) {
    const previewElement = useMemo(() => {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, "text/html");
            const rootElement = doc.body.children;
            return Array.from(rootElement)
          } catch (error) {
            console.log(error);
            return null
          }
    }, [content])
    return (
        <svg fill="none" width={width} height={height} viewBox={`0 0 ${screenWidth} ${screenHeight}`} xmlns="http://www.w3.org/2000/svg" className={"w-full h-full object-contain object-bottom " + className }>
            <foreignObject width={screenWidth} height={screenHeight}>
                <div className="flex flex-col justify-start items-stretch w-full h-full bg-white">
                    { previewElement ?
                    <>
                    {
                        renderElement(
                            previewElement,
                            0,
                            null,
                            null,
                            true, // preview true
                        )
                    }
                    </>
                    : <div>Preview not available</div>
                    } 
                </div>
            </foreignObject>
        </svg>
    )
}