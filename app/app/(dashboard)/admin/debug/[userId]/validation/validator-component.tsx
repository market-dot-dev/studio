"use client";

import PageHeading from "@/components/common/page-heading";
import { Check } from "lucide-react";
import { Tier, User } from "@prisma/client";
import { useState } from "react";

const ValidatorComponent = ({
  user,
  tiers,
}: {
  user: User;
  tiers: Tier[];
}) => {
  const [password, setPassword] = useState("");

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex w-full justify-between">
        <div className="flex flex-row">
          <PageHeading title="User Validation / Migration tool" />
        </div>
      </div>
      <div>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter the stripe private key"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <h2>Current user check: {user.name}</h2>
        <div>Email: {!!user.email ? <Check className="inline" /> : "X"}</div>
        <div>
          Connected Account:{" "}
          {!!user.stripeAccountId ? <Check className="inline" /> : "X"}
        </div>
        <div>
          Legacy stripeProductId:{" "}
          {!!user.legacyStripeProductId ? <Check className="inline" /> : "X"}
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
      </div>
    </div>
  );
};

export default ValidatorComponent;
