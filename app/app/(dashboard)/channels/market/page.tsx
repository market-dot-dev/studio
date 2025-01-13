import { Flex } from "@tremor/react";
import PageHeading from "@/components/common/page-heading";
import MarketComponent from "@/components/channels/market/market-component";
import {
  getPublishedTiersWithFeatures,
  TierWithFeatures,
} from "@/app/services/TierService";
import { getPublishedPackagesForExpert } from "@/app/services/echo-service";
import { getCurrentSite } from "@/app/services/SiteService";

export default async function MarketChannel() {
  const site = await getCurrentSite();
  if (!site) {
    return <div>No site found. Please set up your site first.</div>;
  }

  let publishedPackages: TierWithFeatures[] = [];

  const response = await getPublishedPackagesForExpert();
  if (response) {
    const publishedPackageIds = response.packages;
    publishedPackages =
      await getPublishedTiersWithFeatures(publishedPackageIds);
  }

  return (
    <Flex flexDirection="col" alignItems="start" className="w-full gap-6">
      <div>
        <PageHeading title="Market" />
        <div> Advertise your packages on your market.dev expert page.</div>
      </div>
      <MarketComponent
        subdomain={`${site.subdomain}.gitwallet.co`}
        publishedPackages={publishedPackages}
      />
    </Flex>
  );
}
