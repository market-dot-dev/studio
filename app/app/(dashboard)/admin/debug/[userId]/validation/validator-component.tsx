"use client";

import { Tier, User } from "@/app/generated/prisma";
import PageHeader from "@/components/common/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { useState } from "react";

const ValidatorComponent = ({ user, tiers }: { user: User; tiers: Tier[] }) => {
  const [password, setPassword] = useState("");

  return (
    <div className="flex max-w-screen-xl flex-col space-y-10 p-8">
      <PageHeader title="User Validation / Migration tool" />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Stripe Private Key</Label>
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
        <h2>Current user check: {user.name}</h2>
        <div>Email: {user.email ? <Check className="inline" /> : "X"}</div>
        <div>Connected Account: {user.stripeAccountId ? <Check className="inline" /> : "X"}</div>
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
              <td>{tier.stripeProductId ? <Check className="inline" /> : "X"}</td>
              <td>{tier.stripePriceId ? <Check className="inline" /> : "X"}</td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};

export default ValidatorComponent;
