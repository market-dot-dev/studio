'use client';

import type { SubscriptionCadence } from "@/app/services/StripeService";
import type { TierWithFeatures } from '@/app/services/TierService';
import { Card, Button, Text, Switch } from '@tremor/react';
import Link from 'next/link';
import TierFeatureList from '@/components/features/tier-feature-list';
import { Feature } from '@prisma/client';
import { useState } from 'react';
import { parseTierDescription } from '@/lib/utils';
import { subscriptionCadenceShorthands } from "@/lib/tiers/subscription-cadence-shorthands";
import clsx from 'clsx';

type TierCardProps = {
  url?: string;
  tier: TierWithFeatures;
  buttonDisabled?: boolean;
  darkMode?: boolean;
  features?: Feature[];
  hasActiveFeatures?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export const generateLink = (url: string | null, tierId: string, annual: boolean) => {
  return `${url ? url : ''}/checkout/${tierId}${annual ? '?annual=true' : ''}`;
}

const CheckoutButton = ({ 
  url, 
  tierId, 
  annual = false,
  variant = 'primary', 
}: { 
  url: string | null, 
  tierId: string, 
  annual?: boolean 
  variant?: "secondary" | "primary", 
}) => {
  const checkoutUrl = generateLink(url, tierId, annual);

  return (
    <Link href={checkoutUrl}>
      <Button
        variant={variant}
        className="w-full rounded-md !bg-gradient-to-b from-gray-800 to-gray-950 px-3 py-2 text-center text-sm font-medium text-white shadow-sm ring-1 ring-black/5 transition-shadow hover:bg-gray-700 hover:shadow"
      >
        {annual ? `Get Started` : `Get Started`}
      </Button>
    </Link>
  );
}

const calcDiscount = (price: number, annualPrice: number) => {
  if (price === 0) return 0;
  if (annualPrice === 0) return 100;
  const twelveMonths = price * 12;
  return Math.round(((twelveMonths - annualPrice) / twelveMonths * 100) * 10) / 10;
}



const TierCard: React.FC<TierCardProps> = ({ 
  tier, 
  url = null, 
  darkMode = false, 
  features = [], 
  hasActiveFeatures,
  className,
  children, 
}) => {
  const [showAnnual, setShowAnnual] = useState(false);
  // const [annualDiscountPercent, setAnnualDiscountPercent] = useState(calcDiscount(tier.price, tier.priceAnnual || 0));

  const containerClasses = darkMode
    ? "text-white "
    : "text-gray-900 bg-white";
  
  const textClasses = darkMode ? "text-gray-400" : "text-gray-500";
  
  const hasAnnual = (tier.priceAnnual || 0) > 0;
  const isntOnce = tier.cadence !== 'once';
  const cadenceShorthand = subscriptionCadenceShorthands[tier.cadence as SubscriptionCadence];
  
  const directlyProvidedFeatures = !!features && features.length > 0;
  const tierFeatures = (directlyProvidedFeatures ? features : tier.features) || [];
  const parsedDescription = parseTierDescription(tier.description || '');
  
  return (
    <Card
      className={clsx(
        "relative flex h-full w-full flex-col justify-between rounded-md bg-white p-6 pt-5 shadow ring-1 ring-gray-500/10",
        containerClasses,
        className,
      )}
    >
      <div>
        <h3
          className={clsx(
            "mb-1 font-geist font-semibold text-gray-900",
            textClasses,
          )}
        >
          {tier.name}
        </h3>
        <p className="text-sm text-gray-500">{tier.tagline}</p>
        <div className="mt-6 text-4xl">
          <span className="font-geist-mono">
            $
            {showAnnual ? Math.round((tier.priceAnnual || 0) / 12) : tier.price}
          </span>
          {cadenceShorthand && (
            <span className="text-base/10 font-normal text-gray-500">
              <span className="mr-px">/</span>
              {cadenceShorthand}
            </span>
          )}
        </div>
        {hasAnnual && isntOnce ? (
          <div className="mb-6 mt-1 flex items-center gap-1.5">
            <p className="text-xxs font-medium uppercase tracking-wider text-gray-500">
              Monthly
            </p>
            <Switch
              checked={showAnnual}
              onChange={() => setShowAnnual(!showAnnual)}
            />
            <p className="text-xxs font-medium uppercase tracking-wider text-gray-500">
              Yearly
            </p>
          </div>
        ) : null}
        <div className="flex flex-col gap-4 mt-6">
          {hasActiveFeatures && tierFeatures.length !== 0 ? (
            <TierFeatureList features={tierFeatures} darkMode={darkMode} />
          ) : (
            parsedDescription.map((section, dex) => {
              if (section.text) {
                return (
                  <div key={dex}>
                    {section.text.map((text: string, index: number) => (
                      <Text key={index} className="text-sm text-gray-500">
                        {text}
                      </Text>
                    ))}
                  </div>
                );
              }

              return (
                <TierFeatureList
                  key={dex}
                  features={section.features.map(
                    (feature: string, index: number) => ({
                      id: index,
                      name: feature,
                      isEnabled: true,
                    }),
                  )}
                  darkMode={darkMode}
                />
              );
            })
          )}
        </div>
      </div>
      <div className="w-full mt-12">
        {children || (
          <CheckoutButton
            url={url}
            tierId={tier.id}
            annual={showAnnual && isntOnce}
          />
        )}
      </div>
    </Card>
  );
};

export default TierCard;
