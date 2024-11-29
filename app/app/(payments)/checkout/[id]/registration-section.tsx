"use client";

import { User } from "@prisma/client";
import Tier from "@/app/models/Tier";
import useCurrentSession from "@/app/hooks/use-current-session";
import ProspectiveCheckout from "@/components/checkout/prospective-checkout";
import RegistrationCheckoutSection from "@/components/checkout/checkout";

interface CheckoutProps {
  tier: Tier;
  maintainer: User;
  annual?: boolean;
  contactUsCheckout?: boolean;
}
const Checkout = ({
  tier,
  maintainer,
  annual = false,
  contactUsCheckout = false,
}: CheckoutProps) => {
  const { currentUser: user } = useCurrentSession();
  const userId = user?.id;

  if (contactUsCheckout) {
    return <ProspectiveCheckout tier={tier} />;
  }

  return (
    <RegistrationCheckoutSection
      tier={tier}
      maintainer={maintainer}
      annual={annual}
      userId={userId}
    />
  );
};

export default Checkout;
