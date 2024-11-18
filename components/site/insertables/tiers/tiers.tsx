import { Grid, Col } from '@tremor/react'
import SkeletonTiers from '../../skeleton-tiers';
import TierCard from '@/components/tiers/tier-card';

// This renders the actual component for both server and client sides.
export default function Tiers({ tiers, hasActiveFeatures }: { tiers : any[], hasActiveFeatures?: boolean}) : JSX.Element {
    return (
      <div className="w-fulljustify-center mx-auto flex">
        {tiers.length ? (
          <Grid
            numItems={1}
            numItemsSm={1}
            numItemsLg={tiers.length > 3 ? tiers.length : 3}
            className="mx-auto w-full max-w-screen-2xl gap-6"
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