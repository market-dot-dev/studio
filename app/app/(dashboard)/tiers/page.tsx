import PageHeading from "@/components/common/page-heading";
import TierService from "@/app/services/TierService";
import { Pencil } from "lucide-react";
import Link from "next/link";
import TierCard from "@/components/tiers/tier-card";
import SessionService from "@/app/services/SessionService";
import FeatureService from "@/app/services/feature-service";
import TiersEmptyState from "./empty-state";
import NewTierModal from "@/components/tiers/new-tier-modal";
import CopyCheckoutLinkButton from "@/components/tiers/copy-checkout-link-button";
import clsx from "clsx";

export default async function Tiers() {
  const currentUserId = await SessionService.getCurrentUserId();
  if (!currentUserId) return <>You must log in</>;

  const [tiers, activeFeatures] = await Promise.all([
    TierService.findByUserIdWithFeatures(currentUserId),
    FeatureService.findActiveByCurrentUser(),
  ]);

  const tiersDashboardTitleArea = (
    <div className="flex flex-col">
      <PageHeading title="Packages" />
      <p className="text-sm text-stone-500">
        Packages are what you sell to your customers. You can inlcude them on
        your website or send them to customers directly using a checkout link.
      </p>
    </div>
  );
  return (
    <div className="max-w flex max-w-screen-xl flex-col space-y-12">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <PageHeading title="Packages" />
          <p className="max-w-prose text-balance text-sm text-stone-500">
            Packages are what you sell to your customers. You can inlcude them
            on your website or send them to customers directly using a checkout
            link.
          </p>
        </div>
        {tiers.length > 0 ? (
          <div className="flex flex-row">
            <NewTierModal multiple={false}>New Package</NewTierModal>
          </div>
        ) : null}
      </div>
      <div className="flex flex-col space-y-6">
        <section>
          <div className="max-w-screen-xl">
            {tiers.length === 0 && <TiersEmptyState />}
            <div className="grid grid-cols-1 gap-2 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {tiers.map((tier, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 rounded-xl border bg-stone-200/25 text-center"
                >
                  <div className="flex items-center justify-between gap-4 p-3 pl-5">
                    <div className="flex items-center gap-2">
                      <span
                        className={clsx(
                          "h-[7px] w-[7px] rounded-full",
                          tier.published ? "bg-lime-700" : "bg-stone-400",
                        )}
                      ></span>
                      <p
                        className={clsx(
                          "text-sm font-medium",
                          tier.published ? "text-lime-700" : "text-stone-500",
                        )}
                      >
                        {tier.published ? "Published" : "Draft"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {tier.published && (
                        <>
                          <CopyCheckoutLinkButton tierId={tier.id} />
                          <span className="h-3 border-r border-stone-300" />
                        </>
                      )}
                      <Link
                        href={`tiers/${tier.id}`}
                        className="flex items-center gap-1.5 rounded px-1.5 py-0.5 text-sm font-medium transition-colors duration-200 ease-in-out hover:bg-stone-200 active:bg-stone-300"
                      >
                        <Pencil className="h-3.5 w-3.5" strokeWidth={2.25} />
                        Edit
                      </Link>
                    </div>
                  </div>
                  <div className="flex h-full items-center justify-center p-6 pb-10 pt-0">
                    <TierCard
                      buttonDisabled={true}
                      tier={tier}
                      hasActiveFeatures={!!activeFeatures?.length}
                      className="m-auto max-w-xs sm:scale-90"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
