"use server";

import TierService from "@/app/services/TierService";
import UserService from "@/app/services/UserService";
import PageHeading from "@/components/common/page-heading";
import { Check } from "lucide-react";
import prisma from "@/lib/prisma";

const StripeDebug = async () => {
  const user = await UserService.getCurrentUser();
  if (!user) {
    return <div>Not logged in</div>;
  }

  const tiers = await TierService.findByUserId(user.id);
  const legacyProducts = await prisma.legacyProduct.findMany({
    where: {
      maintainerUserId: user.id,
    },
    include: {
      maintainer: true,
      tier: true,
      subscription: {
        include: {
          tier: true,
          user: true,
        }
      },
    }
  });

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex w-full justify-between">
        <div className="flex flex-row">
          <PageHeading title="User Validation / Migration tool" />
        </div>
      </div>
      <div>
        <h2>{user.name}</h2>
        <div>Email: {!!user.email ? <Check className="inline" /> : "X"}</div>
        <div>
          Connected Account:{" "}
          {!!user.stripeAccountId ? <Check className="inline" /> : "X"}
        </div>
        <br />

        <h3>Tiers</h3>
        <table>
          <tr>
            <th>Name</th>
            <th>Stripe Product</th>
            <th>Stripe Price</th>
          </tr>
          {tiers.map((tier) => (
            <tr key={tier.id}>
              <td>{tier.name}</td>
              <td>
                {!!tier.stripeProductId ? <Check className="inline" /> : "X"}
              </td>
              <td>
                {!!tier.stripePriceId ? <Check className="inline" /> : "X"}
              </td>
            </tr>
          ))}
        </table>

        <h3>Legacy Subscriptions</h3>
        <table>
          <tr>
            <th>subscriber</th>
            <th>tier</th>
            <th>stripeProductId</th>
            <th>stripeSubscriptionId</th>
          </tr>
          {legacyProducts.map((lp) => (
            <tr key={lp.id}>
              <td>{lp.subscription.user.email}</td>
              <td>
                {lp.tier.name}
              </td>
              <td>
                {lp.stripeProductId}
              </td>
              <td>
                {lp.subscription.stripeSubscriptionId}
              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};

export default StripeDebug;
