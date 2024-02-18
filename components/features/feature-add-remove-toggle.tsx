import React from "react";
import { Feature } from "@prisma/client";
import { Switch } from "@tremor/react";

interface FeatureAddRemoveToggleProps {
  feature: Feature;
  isAttached: boolean;
  onToggle: () => void;
}

const FeatureAddRemoveToggle: React.FC<FeatureAddRemoveToggleProps> = ({ feature, isAttached, onToggle }) => {
  return (
    <div>
      <Switch 
        id={`feature-switch-${feature.id}`} 
        name={`feature-switch-${feature.id}`} 
        checked={isAttached} 
        onChange={onToggle} 
      />
    </div>
  );
};

export default FeatureAddRemoveToggle;