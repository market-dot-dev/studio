'use client';

import { TierWithFeatures } from '@/app/services/TierService';
import { Card, Button, Text, Switch } from '@tremor/react';
import Link from 'next/link';
import TierFeatureList from '@/components/features/tier-feature-list';
import { Feature } from '@prisma/client';
import { useState } from 'react';

type TierCardProps = {
  url?: string;
  tier: TierWithFeatures;
  canEdit?: boolean;
  buttonDisabled?: boolean;
  darkMode?: boolean;
  children?: React.ReactNode;
  features?: Feature[];
};

export const generateLink = (url: string | null, tierId: string, annual: boolean) => {
  return `${url ? url : ''}/checkout/${tierId}${annual ? '?annual=true' : ''}`;
}

const GetStartedButton = ({ url, tierId, canEdit, annual = false }: { url: string | null, tierId: string, canEdit: boolean, annual?: boolean }) => {
  const linkUrl = generateLink(url, tierId, annual);
  const variant = canEdit ? "secondary" : "primary";

  return (
    <Link href={linkUrl}>
      <Button variant={variant} className="w-full">
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


const TierCard: React.FC<TierCardProps> = ({ tier, url = null, canEdit = false, darkMode = false, features = [], children }) => {
  const containerClasses = darkMode
    ? "text-white bg-gray-800 border-gray-600"
    : "text-gray-900 bg-white border-gray-100";
  
  const hasAnnual = (tier.priceAnnual || 0) > 0;
  const isntOnce = tier.cadence !== 'once'
  const [showAnnual, setShowAnnual] = useState(false);
  const textClasses = darkMode ? "text-gray-400" : "text-gray-500";
  // check if this componenet has been called with features passed to it (e.g. when editing tier in preview)
  const directlyProvidedFeatures = !!features && features.length > 0;
	const [annualDiscountPercent, setAnnualDiscountPercent] = useState(calcDiscount(tier.price, tier.priceAnnual || 0));

  // if features are directly provided, use them, otherwise use the features from the tier
  const tierFeatures = (directlyProvidedFeatures ? features : tier.features) || [];

  return (<>
    <Card className={`flex flex-col p-6 mx-auto w-full h-full justify-between max-w-xs text-center rounded-lg border shadow ${containerClasses}`}>
      <div>
        <h3 className={`mb-4 text-2xl font-bold ${textClasses}`}>{tier.name}</h3>
        <p className="mb-4 font-light text-sm text-gray-500 mb-2">{tier.tagline}</p>
        <div className="text-center">
          {hasAnnual && isntOnce ? <>
            <div className="justify-center flex gap-1">
              <Text>Monthly</Text>
              <Switch checked={showAnnual} onChange={() => setShowAnnual(!showAnnual)} /> 
              <Text>Annual</Text>
            </div>
          </>: null}
        </div>

        <div className="flex justify-center items-baseline my-4">
          <span className={`mr-1 text-4xl font-extrabold ${textClasses}`}>${showAnnual ? Math.round((tier.priceAnnual || 0) / 12) : tier.price}</span>
          /&nbsp;
          {/* <span className="text-gray-500 dark:text-gray-400">{showAnnual ? 'per year' : tier.cadence}</span> */}
          <span className="text-gray-500 dark:text-gray-400">{tier.cadence}</span>
        </div>

        <div className="flex justify-center items-baseline my-4">
          <span className={`mr-1 text-4xl font-extrabold ${textClasses}`}>{}</span>
        </div>

        {tierFeatures.length !== 0 && <Text className="text-center text-xs text-gray-400">What&apos;s Included:</Text>}
        <TierFeatureList features={tierFeatures}  darkMode={darkMode} />
      </div>

      <div className="flex flex-col gap-2 w-full mt-4">
        {canEdit && <Link href={`tiers/${tier.id}`}><Button variant="primary" className="w-full">Edit</Button></Link>}
        { children ? children : <>
          <GetStartedButton url={url} tierId={tier.id} canEdit={canEdit} annual={showAnnual && isntOnce} />
        </>}
      </div>
    </Card>
  </>);
};

export default TierCard;