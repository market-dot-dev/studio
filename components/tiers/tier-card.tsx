'use client';

import PrimaryButton from '@/components/common/link-button';
import { TierWithFeatures } from '@/app/services/TierService';
import { Card, Button, Text } from '@tremor/react';
import Link from 'next/link';
import TierFeatureList from '@/components/features/tier-feature-list';
import useFeatures from '@/app/hooks/use-features';

type TierCardProps = {
  url?: string;
  tier: TierWithFeatures;
  canEdit?: boolean;
  darkMode?: boolean;
};

const TierCard: React.FC<TierCardProps> = ({ tier, url = null, canEdit = false, darkMode = false }) => {

  const containerClasses = darkMode
    ? "text-white bg-gray-800 border-gray-600"
    : "text-gray-900 bg-white border-gray-100";

  const textClasses = darkMode ? "text-gray-400" : "text-gray-500";

  return (<>
    <Card className={`flex flex-col p-6 mx-auto w-full max-w-xs text-center rounded-lg border shadow ${containerClasses}`}>
      <h3 className={`mb-2 text-2xl font-bold ${textClasses}`}>{tier.name}</h3>
      <p className="font-light text-gray-500">{tier.tagline}</p>
      <div className="flex justify-center items-baseline my-4">
        <span className={`mr-1 text-4xl font-extrabold ${textClasses}`}>${tier.price}</span>
        /&nbsp;
        <span className="text-gray-500 dark:text-gray-400">{'month' /*tier.frequency */}</span>
      </div>
      <Text className="text-center text-xs text-gray-400">What's Included:</Text>
      <TierFeatureList features={tier.features || []} darkMode={darkMode} />

      <div className="flex flex-col gap-2 w-full mt-2">
        {canEdit && <Link href={`tiers/${tier.id}`}><Button variant="primary" className="w-full">Edit</Button></Link>}
        <Link href={`${url ? url : ''}/checkout/${tier.id}`}><Button variant={canEdit? "secondary" : "primary"} className="w-full">Get Started</Button></Link>
      </div>

    </Card>
  </>);
};

export default TierCard;