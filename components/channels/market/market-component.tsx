"use client";

import { Title } from "@tremor/react";
import SelectPackagesButton from "./select-packages-button";
import PackagesDisplay from "./packages-display";
import { TierWithFeatures } from "@/app/services/TierService";
import { useState } from "react";

export default function MarketComponent({ site }: { site: any }) {
  const [selectedTiers, setSelectedTiers] = useState<TierWithFeatures[]>([]);

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
        <PackagesDisplay site={site} selectedTiers={selectedTiers} />
      </div>
    </div>
  );
}
