import { Grid, Col } from '@tremor/react';
import SkeletonTiers from '../../skeleton-tiers';
import TierCard from '@/components/tiers/tier-card';

// This renders the actual component for both server and client sides.
export default function Tiers({tiers, hasActiveFeatures}: { tiers : any[], hasActiveFeatures?: boolean}) : JSX.Element {
    return (
        <div className="flex flex-col space-y-6">
            <section>
            <div className="mx-auto max-w-screen-xl lg:py-4">
                { tiers.length ? 
                // <Grid numItems={1} numItemsSm={1} numItemsMd={tiers.length < 2 ? tiers.length : 2} numItemsLg={tiers.length < 3 ? tiers.length : 3} className="gap-12" >
                <div className="flex justify-center gap-12 flex-wrap">
                    {tiers.map((tier : any, index: number) => (
                        <div key={index} className="flex flex-col min-w-[300px]">
                            <TierCard tier={tier} hasActiveFeatures={hasActiveFeatures} />
                        </div>
                    ))}
                </div>
                // </Grid> 
                : 
                <SkeletonTiers />
                }
            </div>
            </section>
        </div>
    )
}