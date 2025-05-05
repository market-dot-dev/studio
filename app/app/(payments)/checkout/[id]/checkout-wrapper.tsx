import { getSubscriptionStatus } from "@/app/services/subscription-service";
import { type VendorProfile } from "@/types/checkout";
import { Contract, Tier } from "@prisma/client";
import { ContactFormCheckout } from "./contact-form-checkout";
import { DirectPaymentCheckout } from "./direct-payment-checkout";
import { SubscriptionStatus } from "./subscription-status";

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

  // Skip status check if no user is logged in
  if (!userId) {
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

  // Get detailed subscription status
  const subscriptionStatus = await getSubscriptionStatus(userId, tier.id);

  // For actively renewing subscriptions, just show the status view
  if (subscriptionStatus.statusType === "active_renewing") {
    return (
      <SubscriptionStatus
        subscriptionId={subscriptionStatus.subscription!.id}
        tierName={tier.name}
        isActive={true}
        expiryDate={null}
      />
    );
  }

  // For cancelled-but-active subscriptions, show both status and checkout
  if (subscriptionStatus.statusType === "cancelled_active") {
    return (
      <div className="space-y-8">
        <SubscriptionStatus
          subscriptionId={subscriptionStatus.subscription!.id}
          tierName={tier.name}
          isActive={false}
          expiryDate={subscriptionStatus.expiryDate}
        />

        <div className="border-t border-stone-200 pt-8">
          <h3 className="mb-6 text-center text-lg font-medium text-stone-800">
            Renew your subscription
          </h3>
          <DirectPaymentCheckout
            tier={tier}
            vendor={vendor}
            contract={contract}
            annual={annual}
            userId={userId}
            isRenewal={true}
          />
        </div>
      </div>
    );
  }

  // For both non-subscribers and expired subscriptions, show the checkout
  // with isRenewal=true for expired subscriptions
  const isRenewal = subscriptionStatus.statusType === "expired";

  return (
    <DirectPaymentCheckout
      tier={tier}
      vendor={vendor}
      contract={contract}
      annual={annual}
      userId={userId}
      isRenewal={isRenewal}
    />
  );
}
