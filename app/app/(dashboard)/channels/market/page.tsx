import { Flex, Text, Button } from "@tremor/react";
import PageHeading from "@/components/common/page-heading";
import { getCurrentUser } from "@/app/services/UserService";
import ConnectionRequired from "@/components/channels/market/connection-required";
import MarketPreview from "@/components/channels/market/market-preview";
import Link from "next/link";

export default async function MarketChannel() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return <div>Not logged in</div>;
  }

  const isConnectedToMarket = currentUser.marketExpertId != null;

  return (
    <Flex flexDirection="col" alignItems="start" className="w-full gap-6">
      <PageHeading title="explore.market.dev" />

      {!isConnectedToMarket ? (
        <ConnectionRequired user={currentUser} />
      ) : (
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full items-center justify-between">
            <Text className="text-black">
              You have an expert profile on explore.market.dev, and can use it to advertise products and services to sell.{" "}
              <Link
                className="underline"
                href={`${process.env.NEXT_PUBLIC_MARKET_DEV_BASE_URL}/experts/${currentUser.gh_username}`}
                target="_blank"
              >
                Check it out
              </Link>
            </Text>

            <Link href="/tiers">
              <Button className="bg-black">Manage packages</Button>
            </Link>
          </div>
          <MarketPreview
            username={currentUser.gh_username!}
            baseUrl={process.env.NEXT_PUBLIC_MARKET_DEV_BASE_URL!}
          />
        </div>
      )}
    </Flex>
  );
}
