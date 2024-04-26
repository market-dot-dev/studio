'use client';
import { useState } from 'react';
import { TierWithFeatures, updateApplicationFee } from '@/app/services/TierService';
import { Button, NumberInput } from "@tremor/react";

export default function TierForm({ tier }: { tier: TierWithFeatures; }) {
  const [applicationFeePercent, setApplicationFeePercent] = useState(tier.applicationFeePercent || 0);
  const [applicationFeePrice, setApplicationFeePrice] = useState(tier.applicationFeePrice || 0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await updateApplicationFee(tier.id, applicationFeePercent, applicationFeePrice);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">
          Application fee (%)&nbsp;
        </label>
        <NumberInput
          id="applicationFeePercent"
          placeholder="Enter a percentage (0-100)"
          required
          name="applicationFeePercent"
          disabled={false}
          enableStepper={false}
          error={!!tier.applicationFeePercent && tier.applicationFeePercent >= 100}
          errorMessage={`Your fee cannot be more than 100%`}
          value={applicationFeePercent}
          onValueChange={(value) => setApplicationFeePercent(value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white">
          Application fee price ($)&nbsp;
        </label>
        <NumberInput
          id="applicationFeePrice"
          placeholder="Enter a price in dollars"
          required
          name="applicationFeePrice"
          disabled={false}
          enableStepper={false}
          value={applicationFeePrice}
          onValueChange={(value) => setApplicationFeePrice(value)}
        />
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
}