"use client"; // @TODO: This should be a server component

import { ContactFormCheckout } from "@/app/app/(payments)/checkout/[id]/contact-form-checkout";
import { DirectPaymentCheckout } from "@/app/app/(payments)/checkout/[id]/direct-payment-checkout";
import useCurrentSession from "@/app/hooks/use-current-session";
import Tier from "@/app/models/Tier";
import { Contract, User } from "@prisma/client";

interface CheckoutProps {
  tier: Tier;
  maintainer: User;
  contract?: Contract;
  annual?: boolean;
}

export const CheckoutWrapper = ({ tier, maintainer, contract, annual = false }: CheckoutProps) => {
  const { currentUser: user } = useCurrentSession();
  const userId = user?.id;

  if (tier.checkoutType === "contact-form") {
    return <ContactFormCheckout tier={tier} />;
  }

  return (
    <DirectPaymentCheckout
      tier={tier}
      maintainer={maintainer}
      contract={contract}
      annual={annual}
      userId={userId}
    />
  );
};
