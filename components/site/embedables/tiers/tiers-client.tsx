'use client'
import { useState, useEffect } from "react";
import Tiers from "./tiers";
import { TiersEmbedSettingsProps } from "./tiers-embed-settings";

// This component will be used to prepare data for the preview mode
export default function TiersClient({site, settings}: { site : any, settings: TiersEmbedSettingsProps}) {
    
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
        <Tiers tiers={tiers} subdomain={site.subdomain} settings={settings} />
    )
}