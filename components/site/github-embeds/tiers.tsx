'use client';

import { useState, useEffect } from "react";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// This component will be used to prepare data for the preview mode
export default function Tiers() {
    
    // getting the tiers by means of API routes
    // const [tiers, setTiers] = useState([]);
    const markdown = `| First Header  | Second Header |
    | ------------- | ------------- |
    | Content Cell  | Content Cell  |
    | Content Cell  | Content Cell  |`

    // useEffect(() => {
    //     const getTiers = async () => {
    //         const response = await fetch('/api/preview/tiers');
    //         const tiers = await response.json();
    //         setTiers(tiers);
    //     }
    //     getTiers();
    // }, []);

    return (<>
        <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
    </>)
}