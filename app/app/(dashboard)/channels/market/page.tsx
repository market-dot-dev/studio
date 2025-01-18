import { Button, Flex, Text } from "@tremor/react";
import PageHeading from "@/components/common/page-heading";
import MarketComponent from "@/components/channels/market/market-component";
import {
  getPublishedTiersWithFeatures,
  TierWithFeatures,
} from "@/app/services/TierService";
import { getPublishedPackagesForExpert } from "@/app/services/market-service";
import { getCurrentSite } from "@/app/services/SiteService";
import { getCurrentUser } from "@/app/services/UserService";
import { User } from "@prisma/client";

export default async function MarketChannel() {
  const user = await getCurrentUser();
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

function ConnectToMarketComponent({ user }: { user: User }) {
  return (
    <div className="flex flex-col items-start gap-4">
      <h2 className="font-cal text-xl dark:text-white">
        Connect Market.dev Account
      </h2>
      <Text>
        Connect your Market.dev account to start selling your packages on
        Market.dev.
      </Text>
      <Button>Connect</Button>
    </div>
  );
}
