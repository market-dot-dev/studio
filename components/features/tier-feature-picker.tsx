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
  selectedFeatureIds: Set<string>;
  setSelectedFeatureIds: (features: Set<string>) => void;
  setFeaturesChanged?: (changed: boolean) => void;
  setFeatureObjs?: (features: Feature[]) => void;
}

const TierFeaturePickerWidget: React.FC<TierFeaturePickerWidgetProps> = ({ tierId, newTier, selectedFeatureIds, setSelectedFeatureIds, setFeaturesChanged, setFeatureObjs }) => {
  const newRecord = !tierId;
  const [allFeatures, setAllFeatures] = useState<Feature[]>([]);

  const [pristineFeatureIds, setPristineFeatureIds] = useState<Set<string>>(new Set());

  const [tiersLoading, setTiersLoading] = useState(true);
  const [featuresLoading, setFeaturesLoading] = useState(true);

  const [tier, setTier] = useState<TierWithFeatures | undefined>(newRecord ? newTier : undefined);
  const [otherTiers, setOtherTiers] = useState<TierWithFeatures[]>([]);

  const anyFeatures = allFeatures.length > 0;
  const tiers = [tier, ...otherTiers];

  useEffect(() => {
    findByCurrentUser().then((featuresData) => {
      setAllFeatures(featuresData.filter(f => f.isEnabled));
    }).then(() => setFeaturesLoading(false));

    getTiersForMatrix(tierId, newTier).then((tiersData) => {
      if(newRecord) {
        setPristineFeatureIds(new Set());
        setSelectedFeatureIds(new Set());
        setTier(newTier);
        setTiersLoading(false);
        setOtherTiers(tiersData.filter(t => t.published));
      } else {
        const tiers = tiersData.filter(t => t.published && t.id !== tierId);
        const tier = tiersData.find(t => t.id === tierId);

        if(!tier || !tier.features) {
          console.error("Tier not found", tier, tier?.features);
          throw new Error("Tier not found");
        }

        setTier(tier);
        setSelectedFeatureIds(new Set(tier.features.map(f => f.id)));
        setPristineFeatureIds(new Set(tier.features.map(f => f.id)));
        setOtherTiers(tiers);
      }
    }).then(() => setTiersLoading(false));
  }, [newTier, tierId]);

  useEffect(() => {
    if(selectedFeatureIds !== pristineFeatureIds && setFeaturesChanged) {
      setFeaturesChanged(true);
    }

    if(setFeatureObjs) {
      setFeatureObjs(allFeatures.filter(f => selectedFeatureIds.has(f.id)));
    }
  }, [selectedFeatureIds, pristineFeatureIds]);

  const handleFeatureToggle = async (feature: Feature) => {
    let updatedFeatures = new Set(selectedFeatureIds);
    const featureId = feature.id;

    if (selectedFeatureIds?.has(featureId)) {
      updatedFeatures.delete(featureId);
    } else {
      updatedFeatures.add(featureId);
    }

    setSelectedFeatureIds(updatedFeatures);
  };

  return (
    <div>
      <div className="overflow-x-auto">
        { featuresLoading && <LoadingDots /> }
        { !featuresLoading && !anyFeatures && <Text>You haven&apos;t listed the services you offer yet. You can do that <a href="/features" className="underline">here</a>.</Text> }
        { anyFeatures &&
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  &nbsp;
                </th>
                {tiers.filter(tier => !!tier).map(tier => (
                  <th key={tier?.id || 'new-tier'} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {tier!.name || '(Unnamed Tier)' }
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {allFeatures.map(feature => (
                <tr key={feature.id}>
                  <td className="py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {feature.name}
                  </td>
                  { tiersLoading && <>
                    <td className="py-4 whitespace-nowrap text-sm text-gray-500 text-center" colSpan={tiers.length}>
                      <LoadingDots />
                    </td>
                    </>
                  }
                  { !tiersLoading && tiers.map(tier => {
                    if(!tier) return null;

                    const isAlreadySelected = ((newRecord  && !tier.id) || tier.id === tierId) ? selectedFeatureIds.has(feature.id) : tier?.features?.some(f => f.id === feature.id) || false;

                    return (
                      <td key={tier?.id || 'new-tier'} className="py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        <div className="flex justify-center">
                        { tier.id === tierId ? 
                          <FeatureAddRemoveToggle
                            feature={feature}
                            isAttached={isAlreadySelected}
                            onToggle={() => handleFeatureToggle(feature)}
                          /> :
                          (isAlreadySelected ? <CheckSquare className="text-gray-500" /> : null)
                        }
                        </div>
                      </td>
                    );
                  })}
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