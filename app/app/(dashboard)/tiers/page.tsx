import PageHeading from '@/components/common/page-heading';
import PrimaryButton from '@/components/common/link-button';
import TierService, { TierWithFeatures } from '@/app/services/TierService';
import { Grid } from '@tremor/react';

import UserService from '@/app/services/UserService';
import TierCard from '@/components/tiers/tier-card';

export default async function Tiers() {
  const currentUserId = await UserService.getCurrentUserId();
  if(!currentUserId) return <>You must log in</>;

  const tiers: TierWithFeatures[] = await TierService.findByUserIdWithFeatures(currentUserId);

  return (
    <div className="flex max-w flex-col space-y-12 p-8">
      <div className="flex justify-between w-full">
          <div className="flex flex-row">
            <PageHeading title="Your Active Tiers" />
          </div>
          <div className="flex flex-row">
            <PrimaryButton label="New Tier" href="/tiers/new" />
          </div>
      </div>

      <div className="flex flex-col space-y-6">
        <section>
          <div className="mx-auto max-w-screen-xl lg:py-4">
            { tiers.length === 0 && <div>You have no tiers. Create a new tier to get started.</div> }
            <Grid numItems={3} className="gap-12" >
              {tiers.map((tier, index) => (
                <TierCard key={index} tier={tier} canEdit={true} />
              ))}
            </Grid>
          </div>
        </section>
      </div>
    </div>
  );
}
