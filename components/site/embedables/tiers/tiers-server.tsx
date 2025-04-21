import TierService from "@/app/services/TierService";
import Tiers from "./tiers";
import { TiersEmbedSettingsProps } from "./tiers-embed-settings-props";

export default async function TiersServer({
  site,
  searchParams
}: {
  site: any;
  searchParams: TiersEmbedSettingsProps;
}) {
  const tiers = await TierService.getTiersForUser(site.userId);
  const filteredTiers = tiers.filter((tier: any) => (searchParams.tiers ?? []).includes(tier.id));
  return <Tiers tiers={filteredTiers ?? []} subdomain={site.subdomain} settings={searchParams} />;
}
