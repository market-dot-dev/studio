"use client";
import {
  GLOBAL_APPLICATION_FEE_DOLLARS,
  GLOBAL_APPLICATION_FEE_PCT
} from "@/app/config/stripe-fees";
import { calculateApplicationFee } from "@/app/services/StripeService";
import { TierWithCount, updateApplicationFee } from "@/app/services/TierService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export default function TierForm({ tier }: { tier: TierWithCount }) {
  const [applicationFeePercent, setApplicationFeePercent] = useState(
    tier.applicationFeePercent || 0
  );
  const [applicationFeePrice, setApplicationFeePrice] = useState(tier.applicationFeePrice || 0);
  const [error, setError] = useState<string | null>(null);
  const [examplePrice, setExamplePrice] = useState<number>(0);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await updateApplicationFee(tier.id, applicationFeePercent, applicationFeePrice);
  };

  useEffect(() => {
    calculateApplicationFee(100, applicationFeePercent, applicationFeePrice).then(setExamplePrice);
  }, [applicationFeePercent, applicationFeePrice]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-0.5 block text-sm font-medium text-gray-900 dark:text-white">
          Application fee (%)&nbsp;
        </label>
        <Input
          id="applicationFeePercent"
          name="applicationFeePercent"
          type="number"
          placeholder="Enter a percentage (0-100)"
          required
          disabled={false}
          value={applicationFeePercent}
          min={0}
          onChange={(e) => setApplicationFeePercent(Number(e.target.value))}
          className={
            !!applicationFeePercent && applicationFeePercent >= 100 ? "border-red-500" : ""
          }
        />
        {!!applicationFeePercent && applicationFeePercent >= 100 && (
          <p className="mt-1 text-sm text-red-500">Your fee cannot be more than 100%</p>
        )}
      </div>
      <div>
        <label className="mb-0.5 block text-sm font-medium text-gray-900 dark:text-white">
          Application fee price ($)&nbsp;
        </label>
        <Input
          id="applicationFeePrice"
          name="applicationFeePrice"
          type="number"
          placeholder="Enter a price in dollars"
          required
          disabled={false}
          value={applicationFeePrice}
          onChange={(e) => setApplicationFeePrice(Number(e.target.value))}
        />
      </div>
      <Button type="submit">Save</Button>
      <div className="mb-6 text-sm text-gray-500">
        NB: These are on top of the global fees ({GLOBAL_APPLICATION_FEE_DOLLARS || 0} USD +{" "}
        {GLOBAL_APPLICATION_FEE_PCT || 0}%)
        <br />
        So for a 100 USD payment, the total would be {examplePrice} USD
      </div>
    </form>
  );
}
