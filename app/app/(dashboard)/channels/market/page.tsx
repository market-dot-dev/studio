import { Flex } from "@tremor/react";
import PageHeading from "@/components/common/page-heading";
import { getSite } from "@/lib/site/fetchers";
import MarketComponent from "@/components/channels/market/market-component";

export default async function MarketChannel() {
  const site = await getSite();
  return (
    <Flex flexDirection="col" alignItems="start" className="w-full gap-6">
      <div>
        <PageHeading title="Market" />
        <div> Advertise your packages on your market.dev expert page.</div>
      </div>
      <MarketComponent site={site} />
    </Flex>
  );
}
