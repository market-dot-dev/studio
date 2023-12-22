'use client'
import { useState, useEffect } from "react";
import Tiers from "./tiers";

// This component will be used to prepare data for the preview mode
export default function TiersClient({site, page}: { site : any, page : any}) {
    
    // getting the tiers by means of API routes
    const [tiers, setTiers] = useState([]);

    useEffect(() => {
        const getTiers = async () => {
            const response = await fetch('/api/preview/tiers');
            const tiers = await response.json();
            setTiers(tiers);
        }
        getTiers();
    }, []);

    return (
        <Tiers tiers={tiers} />
    )
}