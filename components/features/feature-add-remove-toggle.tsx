"use client";

import { attach, detach } from "@/app/services/feature-service";
import { Feature, Tier } from "@prisma/client";
import { Switch } from "@tremor/react";
import { useState, useEffect } from "react";

interface FeatureAddRemoveButtonProps {
  feature: Feature;
  tier: Tier;
  isAttached: boolean;
}

const FeatureAddRemoveToggle = ({ feature, tier, isAttached }: FeatureAddRemoveButtonProps) => {
  const [isSwitchOn, setIsSwitchOn] = useState<boolean>(isAttached);

  useEffect(() => {
    setIsSwitchOn(isAttached);
  }, [isAttached]);

  const handleSwitchChange = async (value: boolean) => {
    if (value) {
      await attach({ featureId: feature.id, referenceId: tier.id }, 'tier');
    } else {
      await detach({ featureId: feature.id, referenceId: tier.id }, 'tier');
    }
    setIsSwitchOn(value);
    window.location.reload();
  };

  return (
    <div>
      <Switch 
        id={`feature-switch-${feature.id}`} 
        name={`feature-switch-${feature.id}`} 
        checked={isSwitchOn} 
        onChange={handleSwitchChange} 
      />
    </div>
  );
};

export default FeatureAddRemoveToggle;