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
    <div className="justify-items-center">
      <input type="checkbox" 
        className="border-gray-600 rounded-md p-3 accent-green-400"
        id={`feature-switch-${feature.id}`} 
        name={`feature-switch-${feature.id}`} 
        checked={isAttached} 
        onChange={onToggle} 
      />
    </div>
  );
};

export default FeatureAddRemoveToggle;