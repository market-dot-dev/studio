"use client";
// tier-feature-picker-widget.tsx

import React, { useState, useEffect } from "react";
import { Feature, Tier } from "@prisma/client";
import FeatureAddRemoveToggle from "@/components/features/feature-add-remove-toggle";
import { Text } from "@tremor/react";
import { TierWithFeatures, getTiersForMatrix } from "@/app/services/TierService";
import { findByCurrentUser } from "@/app/services/feature-service";
import LoadingDots from "../icons/loading-dots";
import {
  CheckSquare2 as CheckSquare,
} from "lucide-react";

interface TierFeaturePickerWidgetProps {
  tierId?: string;
  newTier?: Tier;
  selectedFeatures: Record<string, Feature[]>;
  setSelectedFeatures: (features: Record<string, Feature[]>) => void;
  setFeaturesChanged?: (changed: boolean) => void;
}

const TierFeaturePickerWidget: React.FC<TierFeaturePickerWidgetProps> = ({ tierId, newTier, selectedFeatures, setSelectedFeatures, setFeaturesChanged }) => {
  const [savedTiers, setSavedTiers] = useState<TierWithFeatures[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [originalFeatures, setOriginalFeatures] = useState<Record<string, Feature[]>>({});

  const anyFeatures = features.length > 0;

  useEffect(() => {
    getTiersForMatrix(tierId, newTier).then((tiersData) => {
      setSavedTiers(tiersData.filter(t => t.published || t.id === tierId));
    });

    findByCurrentUser().then((featuresData) => {
      setFeatures(featuresData.filter(f => f.isEnabled));
    }).then(() => setLoading(false));
  }, [newTier, tierId])

  
  const tiers: TierWithFeatures[] = newTier ? [newTier, ...savedTiers] : savedTiers;

  useEffect(() => {
    const initialSelection: Record<string, Feature[]> = {};
    savedTiers.forEach(tier => {
      initialSelection[tier.id] = tier.features ?? [];
    });
    setSelectedFeatures(initialSelection);
    setOriginalFeatures(initialSelection);
  }, [savedTiers, setSelectedFeatures]);

  const handleFeatureToggle = async (feature: Feature, tierId: string) => {
    const isAlreadySelected = selectedFeatures[tierId]?.some(f => f.id === feature.id);
    let updatedFeatures;

    if (isAlreadySelected) {
      updatedFeatures = selectedFeatures[tierId].filter(f => f.id !== feature.id);
    } else {
      updatedFeatures = [...(selectedFeatures[tierId] || []), feature];
    }

    setSelectedFeatures({
      ...selectedFeatures,
      [tierId]: updatedFeatures,
    });

    const featuresChanged = JSON.stringify(updatedFeatures) !== JSON.stringify(originalFeatures[tierId]);
    setFeaturesChanged && setFeaturesChanged(featuresChanged);
  };

  return (
    <div>
      <div className="overflow-x-auto">
        { loading && <LoadingDots /> }
        { !loading && !anyFeatures && <Text>You haven&apos;t listed the services you offer yet. You can do that <a href="/features" className="underline">here</a>.</Text> }
        { anyFeatures &&
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  &nbsp;
                </th>
                {tiers.length > 0 ? tiers.map(tier => (
                  <th key={tier.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {tier.name || '(Unnamed Tier)' }
                  </th>
                )) : <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No tiers available</th>}
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {features.map(feature => (
                <tr key={feature.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {feature.name}
                  </td>
                  {tiers.map(tier => (
                    <td key={tier.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      { tier.id === tierId ? 
                      <FeatureAddRemoveToggle
                        feature={feature}
                        isAttached={selectedFeatures[tier.id]?.some(f => f.id === feature.id)}
                        onToggle={() => handleFeatureToggle(feature, tier.id).catch(console.error)}
                      /> :
                      <CheckSquare className="text-green-500" />
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    </div>
  );
};

export default TierFeaturePickerWidget;