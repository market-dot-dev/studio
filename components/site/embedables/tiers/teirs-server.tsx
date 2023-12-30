import { getTiersForUser } from "@/lib/tiers/fetchers";
import Tiers from "./tiers";

// This is the component that will prepare data before rendering the page at the frontend
export default async function TiersServer({site}: { site : any}) {
    
    // getting the tiers by means of server functions
    const tiers = site?.userId ? await getTiersForUser(site.userId) : [];
    return (
        <Tiers tiers={tiers ?? []} />
    )
}