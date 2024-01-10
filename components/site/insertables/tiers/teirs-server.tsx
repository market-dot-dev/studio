import Tiers from "./tiers";
import TierService from "@/app/services/TierService";

// This is the component that will prepare data before rendering the page at the frontend
export default async function TiersServer({site, page}: { site : any, page : any}) {
    // getting the tiers by means of server functions
    const tiers = site?.userId ? await TierService.getTiersForUser(site.userId) : [];
    return (
        <Tiers tiers={tiers ?? []} />
    )
}