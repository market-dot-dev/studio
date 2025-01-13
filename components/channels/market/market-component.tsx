"use client";

import { Title, Button } from "@tremor/react";
import SelectPackagesButton from "./select-packages-button";
import PackagesDisplay from "./packages-display";
import { TierWithFeatures } from "@/app/services/TierService";
import { useState } from "react";
import { updatePublishedPackagesForExpert } from "@/app/services/echo-service";
import { getUserSiteRootUrl } from "@/app/services/domain-service";

export default function MarketComponent({
  subdomain,
  publishedPackages,
}: {
  subdomain: string;
  publishedPackages: TierWithFeatures[];
}) {
  const [selectedTiers, setSelectedTiers] =
    useState<TierWithFeatures[]>(publishedPackages);
  const [isLoading, setIsLoading] = useState(false);
  const siteUrl = getUserSiteRootUrl(subdomain);

  const stateIsUpdateable = () => {
    const publishedIds = new Set(publishedPackages.map((pkg) => pkg.id));
    const selectedIds = new Set(selectedTiers.map((tier) => tier.id));
    if (publishedIds.size !== selectedIds.size) return true;
    for (let id of publishedIds) {
      if (!selectedIds.has(id)) return true;
    }

    return false;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    await updatePublishedPackagesForExpert(
      subdomain,
      selectedTiers.map((tier) => tier.id),
    );
    setIsLoading(false);
  };

  return (
    <div className="flex w-full flex-col gap-6 p-4">
      <div>
        <Title className="text-xl font-semibold">Packages</Title>
        <div className="flex items-center justify-between">
          <div>Select the packages you want to advertise.</div>
          <SelectPackagesButton
            selectedTiers={selectedTiers}
            setSelectedTiers={setSelectedTiers}
          />
        </div>
      </div>
      <div className="relative w-full overflow-hidden">
        <PackagesDisplay siteUrl={siteUrl} selectedTiers={selectedTiers} />
      </div>

      <div>
        <Button disabled={!stateIsUpdateable()} onClick={handleSubmit}>
          Push updates to market.dev
        </Button>
      </div>
    </div>
  );
}
