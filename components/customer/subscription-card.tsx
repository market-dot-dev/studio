import { SubscriptionStatusBadge } from "@/app/app/(dashboard)/customers/subscription-state";
import { CancelSubscriptionBtn } from "@/app/app/c/subscriptions/cancel-subscription-btn";
import { ReactivateSubscriptionBtn } from "@/app/app/c/subscriptions/reactivate-subscription-btn";
import { Subscription } from "@/app/generated/prisma";
import { getContract } from "@/app/services/contract-service";
import { getTierById } from "@/app/services/tier/tier-service";
import UserService from "@/app/services/UserService";
import { TierDetailsModal } from "@/components/tiers/tier-details-modal";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { isCancelled, isFinishingMonth, isRenewing } from "@/types/subscription";
import { Store } from "lucide-react";
import Link from "next/link";

const SubscriptionCard = async ({
  subscription,
  isCustomerView = true
}: {
  subscription: Subscription;
  isCustomerView?: boolean;
}) => {
  if (!subscription || !subscription.tierId) return null;

  const tier = await getTierById(subscription.tierId!);
  if (!tier) return null;

  const maintainer = await UserService.findUser(tier.userId);

  if (!maintainer) return null;

  const actualCadence = subscription.priceAnnual ? "year" : tier.cadence;
  const actualPrice = subscription.priceAnnual ? tier.priceAnnual : tier.price;
  const shortenedCadence =
    actualCadence === "month" ? "mo" : actualCadence === "year" ? "yr" : actualCadence;

  const contract = (await getContract(tier.contractId || "")) || undefined;

  // Check if this is a cancelled but still active subscription that can be reactivated
  const canReactivate = isCancelled(subscription) && isFinishingMonth(subscription);

  const contractUrl = contract ? `/c/contracts/${contract.id}` : "/c/contracts/standard-msa";
  const contractName = contract?.name || "Standard MSA";

  return (
    <Card className="flex flex-col text-sm">
      <div className="flex grow flex-col gap-4 p-5 pr-4 pt-4">
        <div className="flex flex-wrap justify-between gap-2">
          <div className="flex items-center gap-0.5">
            <h3 className="text-base font-semibold">
              {tier.name} {subscription.priceAnnual ? "(annual)" : ""}
            </h3>
            <TierDetailsModal tier={tier} />
          </div>
          <SubscriptionStatusBadge subscription={subscription} />
        </div>
        <p className="text-xl font-semibold text-stone-800">
          USD ${actualPrice}
          <span className="text-lg/5 font-medium text-stone-500">/{shortenedCadence}</span>
        </p>
        <div className="flex flex-row flex-wrap gap-x-10 gap-y-4">
          {isCustomerView && (
            <div className="flex flex-col gap-1">
              <span className="whitespace-nowrap text-xxs/4 font-medium uppercase tracking-wide text-stone-500">
                Seller
              </span>
              <div className="flex items-center gap-1.5">
                <Store size={14} strokeWidth={2.25} />
                <span className="font-medium">{maintainer.projectName}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <span className="whitespace-nowrap text-xxs/4 font-medium uppercase tracking-wide text-stone-500">
              Subscribed On
            </span>
            <span className="font-medium">
              {formatDate(subscription.createdAt.toLocaleDateString())}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="whitespace-nowrap text-xxs/4 font-medium uppercase tracking-wide text-stone-500">
              Contract
            </span>
            <Link href={contractUrl} className="inline font-medium underline" target="_blank">
              {contractName}
            </Link>
          </div>
        </div>
      </div>

      <Separator />

      {isRenewing(subscription) && (
        <CancelSubscriptionBtn
          subscriptionId={subscription.id}
          size="lg"
          variant="outline"
          className="w-full rounded-b-md rounded-t-none shadow-none"
        />
      )}
      {canReactivate && (
        <ReactivateSubscriptionBtn
          subscriptionId={subscription.id}
          size="lg"
          variant="outline"
          className="w-full rounded-b-md rounded-t-none shadow-none"
        />
      )}
    </Card>
  );
};

export default SubscriptionCard;
