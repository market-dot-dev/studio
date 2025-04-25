import { type VendorProfile } from "@/types/checkout";
import { Contract, Tier, User } from "@prisma/client";
import { ContactFormCheckout } from "./contact-form-checkout";
import { DirectPaymentCheckout } from "./direct-payment-checkout";

interface CheckoutWrapperProps {
  tier: Tier;
  vendor: VendorProfile;
  contract?: Contract | null;
  annual: boolean;
  currentUser?: User | null;
}

export function CheckoutWrapper({
  tier,
  vendor,
  contract,
  annual,
  currentUser
}: CheckoutWrapperProps) {
  const userId = currentUser?.id;

  if (tier.checkoutType === "contact-form") {
    return <ContactFormCheckout tier={tier} />;
  }

  return (
    <DirectPaymentCheckout
      tier={tier}
      vendor={vendor}
      contract={contract}
      annual={annual}
      userId={userId}
    />
  );
}
