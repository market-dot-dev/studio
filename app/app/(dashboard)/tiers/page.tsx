import PageHeading from '@/components/common/page-heading';
import PrimaryButton from '@/components/common/link-button';
import TierService, { TierWithFeatures } from '@/app/services/TierService';
import { Grid, Badge } from '@tremor/react';

import TierCard from '@/components/tiers/tier-card';
import SessionService from '@/app/services/SessionService';

export default async function Tiers() {
  const currentUserId = await SessionService.getCurrentUserId();
  if (!currentUserId) return <>You must log in</>;

  const tiers: TierWithFeatures[] = await TierService.findByUserIdWithFeatures(currentUserId);

  return (
    <div className="flex max-w flex-col max-w-screen-xl space-y-12">
      <div className="flex justify-between">
        <div className="flex flex-row">
          <PageHeading title="Tiers" />
        </div>
        <div className="flex flex-row">
          <PrimaryButton label="New Tier" href="/tiers/new" />
        </div>
      </div>

      <div className="flex flex-col space-y-6">
        <section>
          <div className="max-w-screen-xl">
            {tiers.length === 0 && <div>You have no tiers. Create a new tier to get started.</div>}
            <Grid numItems={4} className="gap-8" >
              {tiers.map((tier, index) => (
                <>
                <div key={index} className='text-center mb-8'>
                  <Badge className="mb-2 mx-auto" color={tier.published ? 'green' : 'gray'}>{tier.published ? 'Active' : 'Inactive'}</Badge>
                  <TierCard tier={tier} canEdit={true} />
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
