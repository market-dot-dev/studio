"use client";

import { User, Contract } from "@prisma/client";
import Tier from "@/app/models/Tier";
import useCurrentSession from "@/app/hooks/use-current-session";
import ProspectiveCheckout from "@/components/checkout/prospective-checkout";
import RegistrationCheckoutSection from "@/components/checkout/checkout";

interface CheckoutProps {
  tier: Tier;
  maintainer: User;
  contract?: Contract;
  annual?: boolean;
}

const Checkout = ({ tier, maintainer, contract, annual = false }: CheckoutProps) => {
  const { currentUser: user } = useCurrentSession();
  const userId = user?.id;

  if (tier.checkoutType === "contact-form") {
    return <ProspectiveCheckout tier={tier} />;
  }

  return (
    <RegistrationCheckoutSection
      tier={tier}
      maintainer={maintainer}
      contract={contract}
      annual={annual}
      userId={userId}
    />
  );
};

export default Checkout;
