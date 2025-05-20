import { getPublishedTiersForOrganization } from "@/app/services/tier-service";
import type { SiteMeta } from "@/lib/site/types";
import Tiers from "./tiers";
import { TiersEmbedSettingsProps } from "./tiers-embed-settings-props";

// This is the component that will prepare data before rendering the page at the frontend
export default async function TiersServer({
  site,
  searchParams
}: {
  site: SiteMeta;
  searchParams: TiersEmbedSettingsProps;
}) {
  const tiers = await getPublishedTiersForOrganization(site.userId);
  const filteredTiers = tiers.filter((tier: any) => (searchParams.tiers ?? []).includes(tier.id));
  return (
    <Tiers tiers={filteredTiers ?? []} subdomain={site.subdomain ?? ""} settings={searchParams} />
  );
}
