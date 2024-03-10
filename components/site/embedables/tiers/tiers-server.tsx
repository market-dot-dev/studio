import Tiers from "./tiers";
import { TiersEmbedSettingsProps } from "./tiers-embed-settings";
import TierService from "@/app/services/TierService";

// This is the component that will prepare data before rendering the page at the frontend
export default async function TiersServer({site, searchParams}: { site : any, searchParams: TiersEmbedSettingsProps}) {
    // getting the tiers by means of server functions
    const tiers = site?.userId ? await TierService.getTiersForUser(site.userId) : [];
    const filteredTiers = tiers.filter((tier: any) => (searchParams.tiers ?? []).includes(tier.id));
    return (
        <Tiers tiers={filteredTiers ?? []}  subdomain={site.subdomain} settings={searchParams} />
    )
}