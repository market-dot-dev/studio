import { getTiersForUser } from "@/lib/tiers/fetchers";
import Tiers from "./tiers";

import { TiersEmbedSettingsProps } from "./tiers-embed-settings";

// This is the component that will prepare data before rendering the page at the frontend
export default async function TiersServer({site, searchParams}: { site : any, searchParams: TiersEmbedSettingsProps}) {
    // getting the tiers by means of server functions
    const tiers = site?.userId ? await getTiersForUser(site.userId) : [];
    return (
        <Tiers tiers={tiers ?? []}  subdomain={site.subdomain} settings={searchParams} />
    )
}