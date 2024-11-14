import { Grid, Col } from '@tremor/react';
import SkeletonTiers from '../../skeleton-tiers';
import TierCard from '@/components/tiers/tier-card';

// This renders the actual component for both server and client sides.
export default function Tiers({ tiers, hasActiveFeatures }: { tiers : any[], hasActiveFeatures?: boolean}) : JSX.Element {
    return (
        <div className="flex justify-center mx-auto max-w-4xl w-full">
            { tiers.length ? 
            <div className="flex justify-center gap-12 flex-wrap">
                {tiers.map((tier : any, index: number) => (
                    <div key={index} className="flex flex-col min-w-[300px]">
                        <TierCard tier={tier} hasActiveFeatures={hasActiveFeatures} />
                    </div>
                ))}
            </div>
            : 
            <SkeletonTiers />
            }
        </div>
    )
}