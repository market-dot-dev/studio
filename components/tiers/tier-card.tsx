'use client';

import PrimaryButton from '@/components/common/link-button';
import { TierWithFeatures } from '@/app/services/TierService';
import { Badge, Col } from '@tremor/react';

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
    <Col className={`flex flex-col p-6 mx-auto w-full max-w-xs text-center rounded-lg border shadow ${containerClasses}`}>
      <h3 className={`mb-2 text-2xl font-semibold ${textClasses}`}>{tier.name}</h3>
      <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">{tier.tagline}</p>
      <div className="flex justify-center items-baseline my-4">
        <span className={`mr-2 text-5xl font-extrabold ${textClasses}`}>{tier.price}</span>
        /&nbsp;
        <span className="text-gray-500 dark:text-gray-400">{'month' /*tier.frequency */}</span>
      </div>
      <TierFeatureList features={tier.features || []} darkMode={darkMode}/>

      <PrimaryButton href={`${url ? url : ''}/checkout/${tier.id}`} label="Get Started" />
      { canEdit && <Link href={`tiers/${tier.id}`}>Edit</Link> }
    </Col>
  </>);
};

export default TierCard;