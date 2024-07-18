import { getTiersForUser } from "@/app/services/TierService";


export default async function TiersPreviewProps(site : any) {
    const tiers = await getTiersForUser(site.userId);
    
    return {
        tiers
    };

}