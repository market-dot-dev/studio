import SkeletonTiers from '../../skeleton-tiers';
import TierCard from '@/components/tiers/tier-card';

import type { JSX } from "react";

// This renders the actual component for both server and client sides.
export default function Tiers({ tiers, hasActiveFeatures }: { tiers : any[], hasActiveFeatures?: boolean}) : JSX.Element {
    return (
      <div className="mx-auto flex justify-center">
        {tiers.length ? (
          <div className="mx-auto flex max-w-screen-2xl flex-wrap justify-center gap-6">
            {tiers.map((tier: any, index: number) => (
              <div key={index} className="w-full min-w-xxs md:max-w-xs">
                <TierCard 
                  tier={tier} 
                  hasActiveFeatures={hasActiveFeatures} 
                  alignment={tiers.length === 1 ? 'center' : 'left'} 
                />
              </div>
            ))}
          </div>
        ) : (
          <SkeletonTiers />
        )}
      </div>
    );
}