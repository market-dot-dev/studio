import { getTierOfUser } from "@/lib/tiers/fetchers";
import { TierEmbedSettingsProps } from "./tier-embed-settings";
import Tier from "../tier";

// This is the component that will prepare data before rendering the page at the frontend
export default async function TierServer({site, searchParams}: { site : any, searchParams: TierEmbedSettingsProps}) {
    // getting the tiers by means of server functions
    const tier = site?.userId && searchParams.id ? await getTierOfUser(site.userId, searchParams.id) : null;
    return (
        <div className="flex flex-col p-6 mx-auto w-full max-w-xs ">
            {tier ? <Tier tier={tier} subdomain={site.subdomain} path={searchParams.path} /> : <div>Not found</div>}
        </div>
    )
}