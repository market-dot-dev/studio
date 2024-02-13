"use client";

import React, { useState, useEffect } from "react";
import { Feature } from "@prisma/client";
import FeatureAddRemoveToggle from "@/components/features/feature-add-remove-toggle";
import { Card } from "@tremor/react";
import { attach, detach } from "@/app/services/feature-service";
import { TierWithFeatures } from "@/app/services/TierService";

interface TierFeaturePickerWidgetProps {
  tiers: TierWithFeatures[];
  features: Feature[];
}

const TierFeaturePickerWidget: React.FC<TierFeaturePickerWidgetProps> = ({ tiers, features }) => {
  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, Feature[]>>({});

  useEffect(() => {
    const initialSelection: Record<string, Feature[]> = {};
    tiers.forEach(tier => {
      initialSelection[tier.id] = tier.features ?? [];
    });
    setSelectedFeatures(initialSelection);
  }, [tiers]);

  const handleFeatureToggle = async (feature: Feature, tierId: string) => {
    const isAlreadySelected = selectedFeatures[tierId]?.some(f => f.id === feature.id);
    let updatedFeatures;

    if (isAlreadySelected) {
      updatedFeatures = selectedFeatures[tierId].filter(f => f.id !== feature.id);
      if(tierId) await detach({ featureId: feature.id, referenceId: tierId }, 'tier');
    } else {
      updatedFeatures = [...(selectedFeatures[tierId] || []), feature];
      if(tierId) await attach({ featureId: feature.id, referenceId: tierId }, 'tier');
    }

    setSelectedFeatures({
      ...selectedFeatures,
      [tierId]: updatedFeatures,
    });
  };

  return (
    <Card className="mt-5">
      <h1 className="text-lg font-semibold pb-4">Configure Features</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Feature
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
                    <FeatureAddRemoveToggle
                      feature={feature}
                      isAttached={selectedFeatures[tier.id]?.some(f => f.id === feature.id)}
                      onToggle={() => handleFeatureToggle(feature, tier.id)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TierFeaturePickerWidget;