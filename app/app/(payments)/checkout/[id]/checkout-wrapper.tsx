import { Contract, Tier } from "@/app/generated/prisma";
import { getSubscriptionStatus } from "@/app/services/subscription-service";
import { type VendorProfile } from "@/types/checkout";
import { ContactFormCheckout } from "./contact-form-checkout";
import { DirectPaymentCheckout } from "./direct-payment-checkout";
import { SubscriptionStatusCard } from "./subscription-status";

interface CheckoutWrapperProps {
  tier: Tier;
  vendor: VendorProfile;
  contract?: Contract | null;
  annual: boolean;
  customerId?: string | undefined;
}

export async function CheckoutWrapper({
  tier,
  vendor,
  contract,
  annual,
  customerId
}: CheckoutWrapperProps) {
  if (tier.checkoutType === "contact-form") {
    return <ContactFormCheckout tier={tier} />;
  }

  // Skip status check if no customer is logged in
  if (!customerId) {
    return (
      <DirectPaymentCheckout
        tier={tier}
        vendor={vendor}
        contract={contract}
        annual={annual}
        customerId={customerId}
      />
    );
  }

  // Get detailed subscription status
  const subStatus = await getSubscriptionStatus(customerId, tier.id);

  // For actively renewing subscriptions, just show the status view
  if (
    subStatus.subscription &&
    (subStatus.statusType === "active_renewing" || subStatus.statusType === "cancelled_active")
  ) {
    return (
      <SubscriptionStatusCard
        subscriptionId={subStatus.subscription.id}
        tierName={tier.name}
        expiryDate={subStatus.expiryDate}
      />
    );
  }

  return (
    <DirectPaymentCheckout
      tier={tier}
      vendor={vendor}
      contract={contract}
      annual={annual}
      customerId={customerId}
    />
  );
}
