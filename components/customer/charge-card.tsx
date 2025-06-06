import { Charge } from "@/app/generated/prisma";
import { getTierByIdForCheckout } from "@/app/services/tier/tier-service";
import { TierDetailsModal } from "@/components/tiers/tier-details-modal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { DollarSign, Store } from "lucide-react";
import Link from "next/link";

const ChargeCard = async ({
  charge,
  isCustomerView = true
}: {
  charge: Charge;
  isCustomerView?: boolean;
}) => {
  if (!charge || !charge.tierId) return null;

  const tier = await getTierByIdForCheckout(charge.tierId!);
  if (!tier || !tier.organization) return null;

  const status = "paid";

  const contractUrl = tier.contract
    ? `/c/contracts/${tier.contract.id}`
    : "/c/contracts/standard-msa";
  const contractName = tier.contract?.name || "Standard MSA";

  return (
    <Card className="text-sm">
      <div className="flex flex-col gap-4 p-5 pr-4 pt-4">
        <div className="flex justify-between gap-2">
          <div className="flex items-center gap-0.5">
            <h3 className="text-base font-semibold">{tier.name}</h3>
            <TierDetailsModal tier={tier} />
          </div>

          <Badge variant="success" className="size-fit">
            <DollarSign className="-mx-0.5 !size-3 !stroke-[2.5]" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <p className="text-xl font-semibold text-stone-800">USD ${tier.price}</p>
        <div className="flex flex-row flex-wrap gap-x-10 gap-y-4">
          {isCustomerView && (
            <div className="flex flex-col gap-1">
              <span className="whitespace-nowrap text-xxs/4 font-medium uppercase tracking-wide text-stone-500">
                Seller
              </span>
              <div className="flex items-center gap-1.5">
                <Store size={14} strokeWidth={2.25} />
                <span className="font-medium">{tier.organization.name}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <span className="whitespace-nowrap text-xxs/4 font-medium uppercase tracking-wide text-stone-500">
              Charged On
            </span>
            <span className="font-medium">{formatDate(charge.createdAt.toLocaleDateString())}</span>
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
    </Card>
  );
};

export default ChargeCard;
