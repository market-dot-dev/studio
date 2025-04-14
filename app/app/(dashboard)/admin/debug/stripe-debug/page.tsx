"use server";

import TierService from "@/app/services/TierService";
import UserService from "@/app/services/UserService";
import { UserAccountWidget } from "@/components/payments/user-account-widget";
import { Card } from "@/components/ui/card";

const StripeDebug = async () => {
  const user = await UserService.getCurrentUser();

  if (!user) {
    return <div>Not logged in</div>;
  }

  const tiers = await TierService.findByUserId(user.id);
  const tier = tiers[0];

  return (
    <div className="px-3">
      <h1>Stripe Debug</h1>
      <Card className="p-6">
        <h2>Customer</h2>
        <h2>Customer ID (for buying subscriptions)</h2>
        {/* <UserCustomerWidget user={user} /> */}
        <h2>Payment method</h2>
        {/* <UserPaymentMethodWidgetWrapper maintainerStripeAccountId={user.stripeAccountId!} maintainerUserId={user.id} /> */}
      </Card>

      <br />

      <Card className="p-6">
        <h2>Maintainer</h2>

        {/*
        <h2>Product ID (for selling subscriptions)</h2>
      <UserProductWidget user={user} /> */}

        <h2>Account ID (for getting paid)</h2>
        <UserAccountWidget user={user} />
      </Card>

      {tiers.map((tier) => (
        <div key={tier.id}>
          <Card className="p-6">
            <h2>
              {tier.name} | {tier.price}
            </h2>
            {/* <TierPriceWidget tierId={tier.id} price={tier.price} stripePriceId={tier.stripePriceId || '' } /> */}
          </Card>
        </div>
      ))}
    </div>
  );
};

export default StripeDebug;
