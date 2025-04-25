import { getCheckoutData } from "@/app/services/checkout-service";
import { TierNotAvailable } from "@/components/tiers/tier-not-available";
import { notFound } from "next/navigation";
import { CheckoutWrapper } from "./checkout-wrapper";
import { ProductInfo } from "./product-info";

export default async function CheckoutPage(props: {
  params: Promise<{ id: string; annual?: string }>;
}) {
  const params = await props.params;
  const id = params.id;
  const isAnnual = params.annual === "true";

  if (!id) {
    return notFound();
  }

  // Single function call to get all required data
  const { tier, contract, vendor, currentUser } = await getCheckoutData(id, isAnnual);

  // Handle tier not found (and vendor)
  if (!tier || (tier.id && !tier.published) || !vendor) {
    return <TierNotAvailable />;
  }

  return (
    <div className="flex min-h-screen flex-col text-stone-800 lg:flex-row">
      {/* Left Column - Product info */}
      <ProductInfo tier={tier} vendor={vendor} isAnnual={isAnnual} />

      {/* Right Column - Checkout */}
      <div className="ml-auto flex min-h-[80vh] w-full flex-col items-center overflow-y-auto bg-stone-100 px-6 py-9 text-stone-800 sm:p-9 lg:w-3/5 lg:p-16 lg:pt-32">
        <CheckoutWrapper
          tier={tier}
          vendor={vendor}
          contract={contract}
          annual={isAnnual}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}
