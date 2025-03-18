"use client";

import PageHeader from "@/components/common/page-header";
import { Check } from "lucide-react";
import StripeCustomerMigrator from "./stripe-customer-migrator";
import { LegacyProduct, Subscription, Tier, User } from "@prisma/client";
import { useState } from "react";
import { Input } from "@/components/ui/input";

type LegacyProductWithExtra = LegacyProduct & {
  subscription: Subscription & { user: User };
  tier: Tier;
  maintainer: User;
};

const MigratorComponent = ({
  user,
  tiers,
  legacyProducts,
}: {
  user: User;
  tiers: Tier[];
  legacyProducts: LegacyProductWithExtra[];
}) => {
  const [password, setPassword] = useState("");

  return (
    <div className="flex max-w-screen-xl flex-col space-y-10 p-8">
      <PageHeader title="Legacy Subscription Migration tool" />
      <div>
        <Input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Enter the stripe private key"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <h3>Legacy Subscriptions</h3>
        <table>
          <tr>
            <th>subscriber</th>
            <th>tier</th>
            <th>stripeProductId</th>
            <th>stripeSubscriptionId</th>
            <th>gw customerId?</th>
            <th>gw paymentMethodId?</th>
            <th>customerId migrated?</th>
            <th>paymentMethodId migrated?</th>
            <th></th>
          </tr>
          {legacyProducts.map((lp) => {
            const maintainer = lp.maintainer;
            const customer = lp.subscription.user;
            const stripeAccountId = lp.maintainer.stripeAccountId;

            const customerLookup =
              (lp.subscription.user.stripeCustomerIds as Record<
                string,
                string
              >) || {};
            const stripeCustomerId = customerLookup[stripeAccountId || ""];
            const gwCustomerId = customerLookup["gitwallet"];

            const paymentLookup =
              (lp.subscription.user.stripePaymentMethodIds as Record<
                string,
                string
              >) || {};
            const stripePaymentMethodId = paymentLookup[stripeAccountId || ""];
            const gwPaymentMethodId = paymentLookup["gitwallet"];

            return (
              <tr key={lp.id}>
                <td>{lp.subscription.user.email}</td>
                <td>{lp.tier.name}</td>
                <td>{lp.stripeProductId}</td>
                <td>{lp.subscription.stripeSubscriptionId}</td>
                <td>{!!gwCustomerId ? <Check className="inline" /> : "X"}</td>
                <td>
                  {!!gwPaymentMethodId ? <Check className="inline" /> : "X"}
                </td>
                <td>
                  {!!stripeCustomerId ? <Check className="inline" /> : "X"}
                </td>
                <td>
                  {!!stripePaymentMethodId ? <Check className="inline" /> : "X"}
                </td>
                <td>
                  <StripeCustomerMigrator
                    stripeCustomerId={gwCustomerId}
                    stripeAccountId={maintainer.stripeAccountId!}
                    maintainerUserId={maintainer.id}
                    userId={customer.id}
                    stripeSecretKey={password}
                    stripePaymentMethodId={gwPaymentMethodId}
                    userName={customer.name!}
                    userEmail={customer.email!}
                  />
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
};

export default MigratorComponent;
