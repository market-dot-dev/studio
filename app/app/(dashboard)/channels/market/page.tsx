import {
  getCachedGitHubAccountInfo,
  hasGitHubIntegration
} from "@/app/services/integrations/github-integration-service";
import MarketPreview from "@/components/channels/market/market-preview";
import PageHeader from "@/components/common/page-header";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function MarketChannelPage() {
  const isConnectedToMarket = await hasGitHubIntegration(); // per default, all connections are linked
  const accountInfo = await getCachedGitHubAccountInfo();

  return (
    <div className="flex w-full flex-col items-start gap-6">
      <PageHeader title="explore.market.dev" />

      {!isConnectedToMarket ? (
        <>
          <p className="text-sm">
            A GitHub connection is required to connect to explore.market.dev.
          </p>
          <Link href="/settings/integrations" className={buttonVariants({ variant: "default" })}>
            Set it up
          </Link>
        </>
      ) : (
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full items-center justify-between">
            <p className="text-sm text-black">
              You have an expert profile on explore.market.dev, and can use it to advertise products
              and services to sell.{" "}
              <Link
                className="underline"
                href={`${process.env.NEXT_PUBLIC_MARKET_DEV_BASE_URL}/experts/${accountInfo?.login}`}
                target="_blank"
              >
                Check it out
              </Link>
            </p>

            <Link href="/tiers" className={buttonVariants({ variant: "default" })}>
              Manage packages
            </Link>
          </div>
          {accountInfo?.login && (
            <MarketPreview
              username={accountInfo.login}
              baseUrl={process.env.NEXT_PUBLIC_MARKET_DEV_BASE_URL!}
            />
          )}
        </div>
      )}
    </div>
  );
}
