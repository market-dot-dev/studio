import PrimaryButton from '@/components/common/link-button';
import { TierWithFeatures } from '@/app/services/TierService';
import { Col } from '@tremor/react';

import Link from 'next/link';
import TierFeatureList from '@/components/features/tier-feature-list';

type TierCardProps = {
  tier: TierWithFeatures;
  canEdit?: boolean;
};

const TierCard: React.FC<TierCardProps> = ({ tier, canEdit = false }) => (
  <Col className="flex flex-col p-6 mx-auto w-full max-w-xs text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
    <h3 className="mb-2 text-2xl font-semibold">{tier.name}</h3>
    <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">{tier.description}</p>
    <div className="flex justify-center items-baseline my-4">
      <span className="mr-2 text-5xl font-extrabold">{tier.price}</span>
      /&nbsp;
      <span className="text-gray-500 dark:text-gray-400">{'month' /*tier.frequency */}</span>
    </div>
    <TierFeatureList features={tier.features || []} />
    <PrimaryButton href={`/checkout/${tier.id}`} label="Get Started" />
    { canEdit && <Link href={`tiers/${tier.id}`}>Edit</Link> }
  </Col>
);

export default TierCard;