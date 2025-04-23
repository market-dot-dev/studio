import ContractService from "@/app/services/contract-service";
import { getTierById } from "@/app/services/tier-service";
import UserService from "@/app/services/UserService";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Charge } from "@prisma/client";
import { Store } from "lucide-react";
import ContractLink from "./contract-link";

const ChargeCard = async ({
  charge,
  isCustomerView = true
}: {
  charge: Charge;
  isCustomerView?: boolean;
}) => {
  if (!charge || !charge.tierId) return null;

  const tier = await getTierById(charge.tierId!);
  if (!tier) return null;

  const maintainer = await UserService.findUser(tier.userId);

  if (!maintainer) return null;

  const status = "paid";

  const contract = (await ContractService.getContractById(tier.contractId || "")) || undefined;

  return (
    <Card className="text-sm">
      <div className="flex flex-col gap-4 p-5 pr-4 pt-4">
        <div className="flex flex-col">
          <div className="flex justify-between gap-2">
            <h3 className="text-base font-semibold">{tier.name}</h3>
            <Badge variant="success" className="size-fit">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
          {tier.tagline && <p className="line-clamp-2 text-sm text-stone-500">{tier.tagline}</p>}
        </div>
        <p className="mb-1 text-xl font-semibold text-stone-800">USD ${tier.price}</p>
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
            <span className="font-medium">{charge.createdAt.toLocaleDateString()}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="whitespace-nowrap text-xxs/4 font-medium uppercase tracking-wide text-stone-500">
              Contract
            </span>
            <ContractLink contract={contract} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChargeCard;
