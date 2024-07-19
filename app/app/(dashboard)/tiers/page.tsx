import PageHeading from '@/components/common/page-heading';
import PrimaryButton from '@/components/common/link-button';
import TierService, { TierWithFeatures } from '@/app/services/TierService';
import { Grid, Badge, Text } from '@tremor/react';

import TierCard from '@/components/tiers/tier-card';
import SessionService from '@/app/services/SessionService';
import FeatureService from '@/app/services/feature-service';

export default async function Tiers() {
  const currentUserId = await SessionService.getCurrentUserId();
  if (!currentUserId) return <>You must log in</>;

  const [ tiers, activeFeatures ] = await Promise.all([
    TierService.findByUserIdWithFeatures(currentUserId),
    FeatureService.findActiveByCurrentUser(),
  ]);

  return (
    <div className="flex max-w flex-col max-w-screen-xl space-y-12">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <PageHeading title="Your Packages" />
          <Text>Packages are what you sell to your customers. You can inlcude them on your website or send them to customers directly using a checkout link.</Text>
        </div>
        <div className="flex flex-row">
          <PrimaryButton label="New Package" href="/tiers/new" />
        </div>
      </div>

      <div className="flex flex-col space-y-6">
        <section>
          <div className="max-w-screen-xl">
            {tiers.length === 0 && <div>You have no packages defined. Create a new one to get started.</div>}
            <Grid numItemsSm={1} numItemsMd={2} numItemsLg={3} className="gap-8" >
              {tiers.map((tier, index) => (
                <>
                <div key={index} className='text-center mb-8'>
                  <Badge className="mb-2 mx-auto" color={tier.published ? 'green' : 'gray'}>{tier.published ? 'Active' : 'Inactive'}</Badge>
                  <TierCard tier={tier} canEdit={true} hasActiveFeatures={!!activeFeatures?.length}  />
                  </div>
                </>
              ))}
            </Grid>
          </div>
        </section>
      </div>
    </div>
  );
}
