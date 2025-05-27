import { Contract } from "@/app/generated/prisma";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import React, { useState } from "react";

interface StandardCheckoutFormProps {
  tier: {
    contractId?: string | null;
    cadence?: string | null;
    price?: number | null;
    priceAnnual?: number | null;
    trialDays?: number | null;
  };
  contracts: Contract[];
  handleTierDataChange: (name: string, value: number | string | null) => void;
  idPrefix?: string;
}

// Calculate discount percentage between monthly and annual pricing
const calcDiscount = (price: number, annualPrice: number) => {
  if (price === 0) return 0;
  if (annualPrice === 0) return 100;
  const twelveMonths = price * 12;
  return Math.round(((twelveMonths - annualPrice) / twelveMonths) * 100 * 10) / 10;
};

/**
 * Form component for standard checkout configuration
 */
const StandardCheckoutForm: React.FC<StandardCheckoutFormProps> = ({
  tier,
  contracts,
  handleTierDataChange,
  idPrefix = ""
}) => {
  const [trialEnabled, setTrialEnabled] = useState(tier?.trialDays ? tier.trialDays > 0 : false);
  const [annualPlanEnabled, setAnnualPlanEnabled] = useState(
    tier?.priceAnnual ? tier.priceAnnual > 0 : false
  );
  const [annualDiscountPercent, setAnnualDiscountPercent] = useState(
    calcDiscount(tier.price || 0, tier.priceAnnual || 0)
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Label htmlFor={`${idPrefix}contractId`} className="mb-2 block">
          Contract
        </Label>
        <Select
          value={tier.contractId || "standard-msa"}
          onValueChange={(v) => handleTierDataChange("contractId", v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose contract" />
          </SelectTrigger>
          <SelectContent>
            {contracts.map((c, index) => (
              <SelectItem value={c.id} key={index}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-6">
        <div>
          <Label htmlFor={`${idPrefix}cadence`} className="mb-2 block">
            Billing Type
          </Label>
          <Select
            value={tier.cadence || "month"}
            onValueChange={(v) => handleTierDataChange("cadence", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Billing Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Recurring (Monthly)</SelectItem>
              <SelectItem value="once">One Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor={`${idPrefix}price`} className="mb-2 block">
            {tier.cadence === "month" ? "Monthly Price (USD)" : "Price (USD)"}
          </Label>
          <div className="flex gap-2">
            <Input
              id={`${idPrefix}price`}
              name="price"
              type="number"
              value={tier.price || 0}
              placeholder="0"
              min={0}
              required
              onChange={(e) => {
                const v = Number(e.target.value);
                if (annualPlanEnabled) {
                  setAnnualDiscountPercent(calcDiscount(v, tier.priceAnnual || 0));
                }

                handleTierDataChange("price", v);
              }}
            />
          </div>
        </div>

        {tier.cadence === "month" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-6">
              <Checkbox
                id={`${idPrefix}annualPlanEnabled`}
                checked={annualPlanEnabled}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true;
                  setAnnualPlanEnabled(isChecked);

                  if (isChecked) {
                    handleTierDataChange("priceAnnual", tier.priceAnnual || (tier.price || 0) * 12);
                    setAnnualDiscountPercent(0);
                  } else {
                    handleTierDataChange("priceAnnual", 0);
                    setAnnualDiscountPercent(0);
                  }
                }}
                label="Offer annual plan"
              />

              {annualPlanEnabled && (
                <div className="mb-4">
                  <Label htmlFor={`${idPrefix}priceAnnual`} className="mb-2 block">
                    Annual Price (USD)
                  </Label>
                  <Input
                    id={`${idPrefix}priceAnnual`}
                    name="priceAnnual"
                    type="number"
                    placeholder="0"
                    required
                    disabled={!annualPlanEnabled}
                    value={tier.priceAnnual || 0}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setAnnualDiscountPercent(calcDiscount(tier.price || 0, v));
                      handleTierDataChange("priceAnnual", v);
                    }}
                    className={
                      !!tier.priceAnnual && (tier.price || 0) * 12 < (tier.priceAnnual || 0)
                        ? "border-rose-500"
                        : ""
                    }
                  />
                  {!!tier.priceAnnual && (tier.price || 0) * 12 < (tier.priceAnnual || 0) && (
                    <p className="mt-2 text-xs text-rose-600">
                      Your annual plan is equal to or more expensive than the Monthly Plan x 12 ($
                      {(tier.price || 0) * 12}). Please adjust.
                    </p>
                  )}
                  <p className="font-regular mt-3 block text-xs text-stone-500">
                    <strong className="font-semibold">Effective Discount Rate</strong>:{" "}
                    {annualDiscountPercent ? annualDiscountPercent + "%" : "0%"} (compared to
                    annualized monthly {<>${(tier.price || 0) * 12}</>})
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6">
              <Checkbox
                id={`${idPrefix}trialEnabled`}
                checked={trialEnabled}
                onCheckedChange={(checked) => setTrialEnabled(checked === true)}
                label="Offer trial period"
              />

              {trialEnabled && (
                <div>
                  <Label htmlFor={`${idPrefix}trialDays`} className="mb-2 block">
                    Trial Length (Days)
                  </Label>
                  <Input
                    id={`${idPrefix}trialDays`}
                    name="trialDays"
                    type="number"
                    placeholder="Trial length in days"
                    required
                    disabled={!trialEnabled}
                    value={tier.trialDays || 0}
                    min={0}
                    onChange={(e) => handleTierDataChange("trialDays", Number(e.target.value))}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StandardCheckoutForm;
