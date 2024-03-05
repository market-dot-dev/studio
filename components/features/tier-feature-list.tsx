"use client";

import { Feature } from "@prisma/client";
import {
  CheckSquare2 as CheckSquare,
} from "lucide-react";

export const TierFeatureCheck = ({ feature, darkMode = false }: { feature: Feature; darkMode?: boolean }) => {
  const featureIconClasses = darkMode ? "text-green-400" : "text-green-500";

  return (<>
      <CheckSquare className={featureIconClasses} /> &nbsp; {feature.name}
  </>);
}


const TierFeatureList = ({ features, darkMode = false }: { features: Feature[]; darkMode?: boolean }) => {
  return (<>
    <div className="text-left">
      <ul>
        {features.filter((f) => f.isEnabled).map((feature) => (
          <li key={feature.id} className="flex flex-row my-1">
            <TierFeatureCheck feature={feature} darkMode={darkMode} />
          </li>
        ))}
      </ul>
    </div>
  </>);
};

export default TierFeatureList;