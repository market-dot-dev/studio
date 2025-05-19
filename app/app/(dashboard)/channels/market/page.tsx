import { requireUser } from "@/app/services/user-context-service";
import ConnectionRequired from "@/components/channels/market/connection-required";
import MarketPreview from "@/components/channels/market/market-preview";
import PageHeader from "@/components/common/page-header";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function MarketChannel() {
  const currentUser = await requireUser();
  const isConnectedToMarket = currentUser.marketExpertId != null;

  return (
    <div className="flex w-full flex-col items-start gap-6">
      <PageHeader title="explore.market.dev" />

      {!isConnectedToMarket ? (
        <ConnectionRequired user={currentUser} />
      ) : (
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full items-center justify-between">
            <p className="text-sm text-black">
              You have an expert profile on explore.market.dev, and can use it to advertise products
              and services to sell.{" "}
              <Link
                className="underline"
                href={`${process.env.NEXT_PUBLIC_MARKET_DEV_BASE_URL}/experts/${currentUser.gh_username}`}
                target="_blank"
              >
                Check it out
              </Link>
            </p>

            <Link href="/tiers" className={buttonVariants({ variant: "default" })}>
              Manage packages
            </Link>
          </div>
          <MarketPreview
            username={currentUser.gh_username!}
            baseUrl={process.env.NEXT_PUBLIC_MARKET_DEV_BASE_URL!}
          />
        </div>
      )}
    </div>
  );
}
