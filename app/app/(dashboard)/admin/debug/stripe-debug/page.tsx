
"use server";

import UserService from "@/app/services/UserService";
import UserCustomerWidget from "../../../../../../components/payments/user-customer-widget";
import UserProductWidget from "../../../../../../components/payments/user-product-widget";
import { UserPaymentMethodWidgetWrapperSSR } from "@/components/common/user-payment-method-widget"
import UserAccountWidget from "@/components/payments/user-account-widget";
import TierService from "@/app/services/TierService";
import { Card } from "@tremor/react";
import TierPriceWidget from "@/components/payments/tier-price-widget";

const StripeDebug = async () => {
  const user = await UserService.getCurrentUser();

  if(!user) {
    return <div>Not logged in</div>;
  }

  const tiers = await TierService.findByUserId(user.id);

  return (
    <div className="px-3">
      <h1>Stripe Debug</h1>
      <Card decoration="top" decorationColor="indigo">
        <h2>Customer</h2>
        <h2>Customer ID (for buying subscriptions)</h2>
        <UserCustomerWidget user={user} />
        <h2>Payment method</h2>
        <UserPaymentMethodWidgetWrapperSSR />
      </Card>

      <br/>

      <Card decoration="top" decorationColor="indigo">
        <h2>Maintainer</h2>

        <h2>Product ID (for selling subscriptions)</h2>
        <UserProductWidget user={user} />
        
        <h2>Account ID (for getting paid)</h2>
        <UserAccountWidget user={user} />
      </Card>

      { tiers.map((tier) => (
        <div key={tier.id}>
          <Card>
            <h2>{tier.name} | {tier.price}</h2>
            <TierPriceWidget tierId={tier.id} price={tier.price} stripePriceId={tier.stripePriceId || '' } />
          </Card>
        </div>
      ))}
    </div>
  );
};

export default StripeDebug;