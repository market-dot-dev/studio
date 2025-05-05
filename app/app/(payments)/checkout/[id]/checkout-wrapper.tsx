import { checkUserSubscribedToTier } from "@/app/services/subscription-service";
import { type VendorProfile } from "@/types/checkout";
import { Contract, Tier } from "@prisma/client";
import { ContactFormCheckout } from "./contact-form-checkout";
import { DirectPaymentCheckout } from "./direct-payment-checkout";

interface CheckoutWrapperProps {
  tier: Tier;
  vendor: VendorProfile;
  contract?: Contract | null;
  annual: boolean;
  userId?: string | undefined;
}

export async function CheckoutWrapper({
  tier,
  vendor,
  contract,
  annual,
  userId
}: CheckoutWrapperProps) {
  if (tier.checkoutType === "contact-form") {
    return <ContactFormCheckout tier={tier} />;
  }

  const isSubscribed = !userId ? false : await checkUserSubscribedToTier(userId, tier.id);

  return (
    <DirectPaymentCheckout
      tier={tier}
      vendor={vendor}
      contract={contract}
      annual={annual}
      userId={userId}
      isAlreadySubscribed={isSubscribed}
    />
  );
}
