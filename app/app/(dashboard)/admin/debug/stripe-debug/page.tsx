"use server";

import { findByUserId } from "@/app/services/tier-service";
import { Card } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function StripeDebugPage() {
  const session = await getSession();

  if (!session || !session.user) {
    redirect("/login");
  }

  const tiers = await findByUserId(session.user.id);

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
}
