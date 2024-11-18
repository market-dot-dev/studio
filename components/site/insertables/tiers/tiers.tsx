import { Grid, Col } from '@tremor/react'
import SkeletonTiers from '../../skeleton-tiers';
import TierCard from '@/components/tiers/tier-card';
import clsx from 'clsx';

// This renders the actual component for both server and client sides.
export default function Tiers({ tiers, hasActiveFeatures }: { tiers : any[], hasActiveFeatures?: boolean}) : JSX.Element {
    return (
      <div className="mx-auto flex w-fulljustify-center">
        {tiers.length ? (
          <Grid
            numItems={1}
            numItemsSm={1}
            numItemsLg={tiers.length > 3 ? tiers.length : 3}
            className={clsx("gap-6 mx-auto w-full", tiers.length > 3 ? 'max-w-screen-2xl' : 'max-w-screen-xl')}
          >
            {tiers.map((tier: any, index: number) => (
              <Col key={index} className="w-full max-w-lg lg:max-w-xs">
                <TierCard tier={tier} hasActiveFeatures={hasActiveFeatures} />
              </Col>
            ))}
          </Grid>
        ) : (
          <SkeletonTiers />
        )}
      </div>
    );
}