import ChargeService from "@/app/services/charge-service";
import { getTierByIdWithOrg } from "@/app/services/tier/tier-service";
import PageHeader from "@/components/common/page-header";
import { notFound } from "next/navigation";

export default async function ChargeDetail(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const charge = await ChargeService.findCharge(params.id);
  if (!charge) return notFound();

  const tier = await getTierByIdWithOrg(charge.tierId);
  if (!tier) return notFound();

  return (
    <div className="flex max-w-screen-xl flex-col space-y-10 p-6 sm:p-10">
      <PageHeader title={`${tier.organization.name}: ${tier.name}`} />
      <div className="flex flex-col space-y-6">
        <div>{tier.description}</div>
        <div>
          Paid ${tier.price} on {new Date(charge.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
