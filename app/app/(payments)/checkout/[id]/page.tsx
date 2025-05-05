import { getCheckoutData } from "@/app/services/checkout-service";
import { getSubdomainFromString } from "@/app/services/domain-request-service";
import { TierNotAvailable } from "@/components/tiers/tier-not-available";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { BrandBadge } from "./brand-badge";
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

  // If this is a vendor page, check that this tier belongs to them
  const headersList = await headers();
  const subdomain = await getSubdomainFromString(headersList.get("host") || "");
  if (subdomain && ![vendor?.gh_username?.toLowerCase(), "app"].includes(subdomain)) {
    return notFound();
  }

  // Handle tier not found (and vendor)
  if (!tier || (tier.id && !tier.published) || !vendor) {
    return <TierNotAvailable />;
  }

  return (
    <div className="flex min-h-screen flex-col text-stone-800 lg:flex-row">
      {/* Left Column - Product info */}
      <ProductInfo tier={tier} vendor={vendor} isAnnual={isAnnual} />

      {/* Right Column - Checkout */}
      <div className="ml-auto flex min-h-[80vh] w-full flex-col items-center gap-24 overflow-y-auto bg-stone-100 px-6 pb-5 pt-9 text-stone-800 sm:px-9 lg:w-2/3 lg:p-16 lg:pt-28 xl:pt-32 ">
        <CheckoutWrapper
          tier={tier}
          vendor={vendor}
          contract={contract}
          annual={isAnnual}
          userId={currentUser?.id}
        />
        <BrandBadge className="lg:hidden" />
      </div>
    </div>
  );
}
