import { Channel } from "@/app/generated/prisma";
import { getPublishedTiersForOrganization } from "@/app/services/tier-service";
import type { InsertableComponentProps } from "..";
import Tiers from "./tiers";

type Props = InsertableComponentProps & {
  tiers?: string;
};

// This is the component that will prepare data before rendering the page at the frontend
export default async function TiersServer({ site, page, tiers }: Props) {
  const tierIds = tiers ? tiers?.split(",").map((id: string) => id.trim()) : [];
  // getting the tiers by means of server functions
  const tierItems = site.organization
    ? await getPublishedTiersForOrganization(site.organization.id, tierIds, Channel.site)
    : [];
  return <Tiers tiers={tierItems ?? []} />;
}
