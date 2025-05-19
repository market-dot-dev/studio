import { listTiersByUserIdWithCounts } from "@/app/services/tier-service";
import { requireUserSession } from "@/app/services/user-context-service";
import PageHeader from "@/components/common/page-header";
import CopyCheckoutLinkButton from "@/components/tiers/copy-checkout-link-button";
import NewTierModal from "@/components/tiers/new-tier-modal";
import TierCard from "@/components/tiers/tier-card";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import Link from "next/link";
import TiersEmptyState from "./empty-state";

export default async function Tiers() {
  const user = await requireUserSession();
  const tiers = await listTiersByUserIdWithCounts(user.id);

  return (
    <div className="max-w flex max-w-screen-xl flex-col space-y-10">
      <div className="flex items-start justify-between">
        <PageHeader
          title="Packages"
          description="Packages are what you sell to your customers. You can include them on your website or send them to customers directly using a checkout link."
          actions={[
            tiers.length > 0 ? (
              <NewTierModal key="new-package" multiple={false}>
                New Package
              </NewTierModal>
            ) : null
          ]}
        />
      </div>

      <section className="max-w-screen-xl">
        {tiers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {tiers.map((tier, index) => (
              <div key={index} className="flex flex-col rounded-xl border bg-stone-150 text-center">
                <div className="flex items-center justify-between gap-4 p-3 pb-2 pl-5">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-[7px] w-[7px] rounded-full",
                        tier.published ? "bg-success" : "bg-muted-foreground/75"
                      )}
                    ></span>
                    <p
                      className={cn(
                        "text-sm font-medium",
                        tier.published ? "text-success" : "text-muted-foreground"
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
                      <Pencil className="size-3.5" strokeWidth={2.25} />
                      Edit
                    </Link>
                  </div>
                </div>
                <div className="flex h-full items-center justify-center p-6 pb-4 pt-0">
                  <div className="mx-auto w-full max-w-[330px]">
                    <TierCard tier={tier} className="scale-90 shadow-border" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <TiersEmptyState />
        )}
      </section>
    </div>
  );
}
