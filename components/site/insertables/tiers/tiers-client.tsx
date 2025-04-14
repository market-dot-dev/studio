"use client";
import { getPublishedTiers } from "@/app/services/TierService";
import placeholderTiers from "@/lib/constants/placeholder/tiers";
import { Channel, Tier } from "@prisma/client";
import { useEffect, useState } from "react";
import Tiers from "./tiers";

// This component will be used to prepare data for the preview mode
export default function TiersClient({
  site,
  page,
  tiers,
  hasActiveFeatures
}: {
  site: any;
  page: any;
  tiers?: string;
  hasActiveFeatures?: boolean;
}) {
  // getting the tiers by means of API routes
  const [tierItems, setTierItems] = useState<Partial<Tier>[]>([]);
  const tierIds = tiers ? tiers?.split(",").map((id: string) => id.trim()) : [];
  useEffect(() => {
    if (site) {
      getPublishedTiers(tierIds, Channel.site).then((tiers) => {
        setTierItems(tiers);
      });
    } else {
      setTierItems(placeholderTiers);
    }
  }, []);

  return (
    <>
      <Tiers tiers={tierItems} hasActiveFeatures={hasActiveFeatures} />
    </>
  );
}
