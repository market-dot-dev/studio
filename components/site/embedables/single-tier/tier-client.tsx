'use client'
import { useState, useEffect } from "react";
import Tier from "../tier";
import { TierEmbedSettingsProps } from "./tier-embed-settings";

// This component will be used to prepare data for the preview mode
export default function TiersClient({site, settings}: { site : any, settings: TierEmbedSettingsProps}) {
    
    // getting the tiers by means of API routes
    const [tier, setTier] = useState(null);

    useEffect(() => {
        const getTiers = async () => {
            const response = await fetch('/api/preview/tiers/' + settings.id);
            const tier = await response.json();
            setTier(tier);
        }
        getTiers();
    }, [settings.id]);

    if(!tier) return (<div>Select a tier from the dropdown</div>);

    return (
        <Tier tier={tier} subdomain={site.subdomain} path={settings.path} />
    )
}