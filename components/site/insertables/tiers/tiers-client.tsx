'use client'
import { useState, useEffect } from "react";
import Tiers from "./tiers";
import { getPublishedTiers } from "@/app/services/TierService";
import { Tier } from "@prisma/client";
import placeholderTiers from "@/lib/constants/placeholder/tiers";

// This component will be used to prepare data for the preview mode
export default function TiersClient({site, page, tiers}: { site : any, page : any, tiers?: string}) {
    // getting the tiers by means of API routes
    const [tierItems, setTierItems] = useState<Partial<Tier>[]>([]);
    const tierIds = tiers ? tiers?.split(',').map((id: string) => id.trim()) : [];
    useEffect(() => {
        if( site ) {
            getPublishedTiers(tierIds).then((tiers) => {
                setTierItems(tiers);
            });
        } else {
            setTierItems(placeholderTiers);
        }
    }, []);


    return (<>
        <Tiers tiers={tierItems} />
    </>)
}