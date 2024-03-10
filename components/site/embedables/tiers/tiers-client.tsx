'use client';

import { useState, useEffect } from "react";
import Tiers from "./tiers";
import { TiersEmbedSettingsProps } from "./tiers-embed-settings";

// This component will be used to prepare data for the preview mode
export default function TiersClient({site, settings, tiers }: { site : any, settings: TiersEmbedSettingsProps, tiers: any[]}) {
    
    const filteredTiers = tiers.filter((tier: any) => (settings.tiers ?? []).includes(tier.id));

    return (<>
        <Tiers tiers={filteredTiers} subdomain={site.subdomain} settings={settings} />
    </>)
}