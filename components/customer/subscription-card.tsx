import { CancelSubscriptionBtn } from "@/app/app/c/subscriptions/cancel-subscription-btn";
import { ReactivateSubscriptionBtn } from "@/app/app/c/subscriptions/reactivate-subscription-btn";
import { Subscription } from "@/app/generated/prisma";
import ContractService from "@/app/services/contract-service";
import { getTierById } from "@/app/services/tier-service";
import UserService from "@/app/services/UserService";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { isActive, isCancelled, isFinishingMonth, isRenewing } from "@/types/subscription";
import { Store } from "lucide-react";
import { ContractLink } from "../contracts/contract-link";

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

  // Determine subscription status using our helper functions
  let status = "";
  let badgeVariant: "success" | "secondary" | "destructive" = "secondary";

  if (isRenewing(subscription)) {
    status = "Active";
    badgeVariant = "success";
  } else if (isCancelled(subscription)) {
    if (isFinishingMonth(subscription)) {
      // Cancelled but still active
      const daysRemaining = Math.ceil(
        (subscription.activeUntil!.getTime() - new Date().getTime()) / (1000 * 3600 * 24)
      );
      status = `Ending in ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""}`;
      badgeVariant = "secondary";
    } else {
      // Fully expired
      status = "Expired";
      badgeVariant = "destructive";
    }
  }

  const contract = (await ContractService.getContractById(tier.contractId || "")) || undefined;

  // Check if this is a cancelled but still active subscription that can be reactivated
  const canReactivate = isCancelled(subscription) && isFinishingMonth(subscription);

  return (
    <Card className="text-sm">
      <div className="flex flex-col gap-4 p-5 pr-4 pt-4">
        <div className="flex flex-wrap justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold">
              {tier.name} {subscription.priceAnnual ? "(annual)" : ""}
            </h3>
            {tier.tagline && <p className="line-clamp-2 text-sm text-stone-500">{tier.tagline}</p>}
          </div>
          <Badge variant={badgeVariant} className="size-fit">
            {status}
          </Badge>
        </div>
        <p className="mb-1 text-xl font-semibold text-stone-800">
          USD ${actualPrice}
          <span className="font-medium text-stone-500">/{shortenedCadence}</span>
        </p>
        <div className="flex flex-row flex-wrap gap-x-10 gap-y-4">
          {isCustomerView && (
            <div className="flex flex-col gap-1">
              <span className="whitespace-nowrap text-xxs/4 font-medium uppercase tracking-wide text-stone-500">
                Purchased from
              </span>
              <div className="flex items-center gap-1.5">
                <Store size={16} />
                <span className="font-medium">{maintainer.projectName}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <span className="whitespace-nowrap text-xxs/4 font-medium uppercase tracking-wide text-stone-500">
              Purchased On
            </span>
            <span className="font-medium">{subscription.createdAt.toLocaleDateString()}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="whitespace-nowrap text-xxs/4 font-medium uppercase tracking-wide text-stone-500">
              Contract
            </span>
            <ContractLink contract={contract} />
          </div>
        </div>
      </div>

      <div
        className={cn("flex flex-row gap-2 rounded-b-md border-t bg-stone-50 px-5 py-3", {
          "justify-between": isActive(subscription)
        })}
      >
        {isRenewing(subscription) && <CancelSubscriptionBtn subscriptionId={subscription.id} />}

        {canReactivate && <ReactivateSubscriptionBtn subscriptionId={subscription.id} />}
      </div>
    </Card>
  );
};

export default SubscriptionCard;
