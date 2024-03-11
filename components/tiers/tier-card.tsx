'use client';

import { TierWithFeatures } from '@/app/services/TierService';
import { Card, Button, Text } from '@tremor/react';
import Link from 'next/link';
import TierFeatureList from '@/components/features/tier-feature-list';
import { Feature } from '@prisma/client';

type TierCardProps = {
  url?: string;
  tier: TierWithFeatures;
  canEdit?: boolean;
  darkMode?: boolean;
  children?: React.ReactNode;
  features?: Feature[];
};

const TierCard: React.FC<TierCardProps> = ({ tier, url = null, canEdit = false, darkMode = false, features = [], children }) => {
  const containerClasses = darkMode
    ? "text-white bg-gray-800 border-gray-600"
    : "text-gray-900 bg-white border-gray-100";

  const textClasses = darkMode ? "text-gray-400" : "text-gray-500";

  // check if this componenet has been called with features passed to it (e.g. when editing tier in preview)
  const directlyProvidedFeatures = !!features && features.length > 0;

  // if features are directly provided, use them, otherwise use the features from the tier
  const tierFeatures = (directlyProvidedFeatures ? features : tier.features) || [];

  return (<>
    <Card className={`flex flex-col p-6 mx-auto w-full h-full justify-between max-w-xs text-center rounded-lg border shadow ${containerClasses}`}>
      <div>
        <h3 className={`mb-2 text-2xl font-bold ${textClasses}`}>{tier.name}</h3>
        <p className="font-light text-gray-500">{tier.tagline}</p>
        <div className="flex justify-center items-baseline my-4">
          <span className={`mr-1 text-4xl font-extrabold ${textClasses}`}>${tier.price}</span>
          /&nbsp;
          <span className="text-gray-500 dark:text-gray-400">{'month' /*tier.frequency */}</span>
        </div>
        <Text className="text-center text-xs text-gray-400">What&apos;s Included:</Text>
        <TierFeatureList features={tierFeatures}  darkMode={darkMode} />
      </div>

      <div className="flex flex-col gap-2 w-full mt-4">
        {canEdit && <Link href={`tiers/${tier.id}`}><Button variant="primary" className="w-full">Edit</Button></Link>}
        { children ? children : <>
          <Link href={`${url ? url : ''}/checkout/${tier.id}`}><Button variant={canEdit ? "secondary" : "primary"} className="w-full">Get Started</Button></Link>
          </>}
      </div>

    </Card>
  </>);
};

export default TierCard;