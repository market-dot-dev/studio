"use client";

import type { SiteDetails } from "@/types/site";
import Tiers from "./tiers";
import { TiersEmbedSettingsProps } from "./tiers-embed-settings-props";

// This component will be used to prepare data for the preview mode
export default function TiersClient({
  site,
  settings,
  tiers
}: {
  site: SiteDetails | null;
  settings: TiersEmbedSettingsProps;
  tiers: any[];
}) {
  const filteredTiers = tiers.filter((tier: any) => (settings.tiers ?? []).includes(tier.id));

  return <Tiers tiers={filteredTiers} subdomain={site?.subdomain ?? ""} settings={settings} />;
}
