import ChargeService from "@/app/services/charge-service";
import { getTierById } from "@/app/services/tier/tier-service";
import UserService from "@/app/services/UserService";
import PageHeader from "@/components/common/page-header";

export default async function ChargeDetail(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const charge = await ChargeService.findCharge(params.id);
  if (!charge) return null;
  const tier = await getTierById(charge.tierId);
  if (!tier) return null;
  const maintainer = await UserService.findUser(tier.userId);

  return (
    <div className="flex max-w-screen-xl flex-col space-y-10 p-6 sm:p-10">
      <PageHeader title={`${maintainer!.name}: ${tier?.name}`} />
      <div className="flex flex-col space-y-6">
        <div>{tier?.description}</div>
        <div>
          Paid ${tier.price} on {new Date(charge.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
