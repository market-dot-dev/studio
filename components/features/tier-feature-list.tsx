"use client";

import { Feature } from "@prisma/client";
import {
  CheckSquare2 as CheckSquare,
} from "lucide-react";

export const TierFeatureCheck = ({ feature, darkMode = false }: { feature: Partial<Feature>; darkMode?: boolean }) => {
  const featureIconClasses = (darkMode ? "text-green-400" : "text-green-500" )+ " min-w-6";

  return (
    <>
      <CheckSquare className={featureIconClasses} />
      <div>{feature.name}</div>
    </>
  );
}


const TierFeatureList = ({ features, darkMode = false }: { features: Partial<Feature>[]; darkMode?: boolean }) => {
  return (<>
    <div className="text-left">
      <ul>
        {features.filter((f) => f.isEnabled).map((feature) => (
          <li key={feature.id} className="flex flex-row my-1 gap-3">
            <TierFeatureCheck feature={feature} darkMode={darkMode} />
          </li>
        ))}
      </ul>
    </div>
  </>);
};

export default TierFeatureList;