import TierService from "@/app/services/tier-service";
import { Channel } from "@prisma/client";
import Tiers from "./tiers";

// This is the component that will prepare data before rendering the page at the frontend
export default async function TiersServer({
  site,
  page,
  tiers
}: {
  site: any;
  page: any;
  tiers?: string;
}) {
  const tierIds = tiers ? tiers?.split(",").map((id: string) => id.trim()) : [];
  // getting the tiers by means of server functions
  const tierItems = site?.userId
    ? await TierService.getTiersForUser(site.userId, tierIds, Channel.site)
    : [];
  return <Tiers tiers={tierItems ?? []} />;
}
