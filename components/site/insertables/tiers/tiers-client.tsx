"use client";
import { Channel, Tier } from "@/app/generated/prisma";
import { getPublishedTiers } from "@/app/services/tier/tier-service";
import placeholderTiers from "@/lib/constants/placeholder/tiers";
import { useEffect, useState } from "react";
import type { InsertableComponentProps } from "..";
import Tiers from "./tiers";

type Props = InsertableComponentProps & {
  tiers?: string;
};

// This component will be used to prepare data for the preview mode
export default function TiersClient({ site, page, tiers }: Props) {
  // getting the tiers by means of API routes
  const [tierItems, setTierItems] = useState<Partial<Tier>[]>([]);
  const tierIds = tiers ? tiers?.split(",").map((id: string) => id.trim()) : [];
  useEffect(() => {
    if (site) {
      getPublishedTiers(tierIds, Channel.site).then((tiers) => {
        setTierItems(tiers);
      });
    } else {
      setTierItems(
        placeholderTiers.map((p) => {
          return {
            ...p,
            createdAt: new Date(p.createdAt) // Cast string to date
          };
        })
      );
    }
  }, []);

  return (
    <>
      <Tiers tiers={tierItems} />
    </>
  );
}
