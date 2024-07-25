import PageHeading from '@/components/common/page-heading';
import PrimaryButton from '@/components/common/link-button';
import TierService, { TierWithFeatures } from '@/app/services/TierService';
import { Grid, Badge, Text } from '@tremor/react';

import TierCard from '@/components/tiers/tier-card';
import SessionService from '@/app/services/SessionService';
import FeatureService from '@/app/services/feature-service';
import TiersEmptyState from './empty-state';
import TiersDashboard from './tiers-dashboard';

export default async function Tiers() {
  const currentUserId = await SessionService.getCurrentUserId();
  if (!currentUserId) return <>You must log in</>;

  const [ tiers, activeFeatures ] = await Promise.all([
    TierService.findByUserIdWithFeatures(currentUserId),
    FeatureService.findActiveByCurrentUser(),
  ]);

  const tiersDashboardTitleArea = (
    <div className="flex flex-col">
        <PageHeading title="Your Packages" />
        <Text>Packages are what you sell to your customers. You can inlcude them on your website or send them to customers directly using a checkout link.</Text>
      </div>
  )
  return (
    
    <div className="flex max-w flex-col max-w-screen-xl space-y-12">
      <TiersDashboard titleArea={tiersDashboardTitleArea} tiers={tiers}>
        <div className="flex flex-col space-y-6">
          <section>
            <div className="max-w-screen-xl">
              {tiers.length === 0 && <TiersEmptyState />}
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
      </TiersDashboard>
    </div>
  );
}
