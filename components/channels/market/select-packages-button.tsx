"use client";

import { TierWithFeatures } from "@/app/services/TierService";
import PublishedPackagesSelectionModal from "@/components/embedables/package-embeddings/published-packages-selection-modal";
import { useModal } from "@/components/modal/provider";
import { Button, Title } from "@tremor/react";
import { Package } from "lucide-react";

export default function SelectPackagesButton({
  selectedTiers,
  setSelectedTiers,
}: {
  selectedTiers: TierWithFeatures[];
  setSelectedTiers: (tiers: TierWithFeatures[]) => void;
}) {
  const { show, hide } = useModal();
  const header = <Title>Select packages to publish to Market.dev</Title>;

  const showPublishedPackagesSelectionModal = () => {
    show(
      <PublishedPackagesSelectionModal
        hide={hide}
        initTiers={selectedTiers}
        onDoneCallback={(tiers: TierWithFeatures[]) => {
          setSelectedTiers(tiers);
        }}
      />,
      undefined,
      undefined,
      header,
      "w-full md:w-5/6 max-h-[80vh]",
    );
  };

  return (
    <Button
      onClick={showPublishedPackagesSelectionModal}
      className="hover:bg-marketing-primary-hover bg-marketing-primary text-white"
    >
      <span className="flex items-center gap-x-2">
        <Package size={18} />
        <span>Select Packages</span>
      </span>
    </Button>
  );
}
