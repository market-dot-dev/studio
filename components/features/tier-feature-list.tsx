"use client";

import { Feature } from "@prisma/client";
import {
  CheckSquare2 as CheckSquare,
} from "lucide-react";


const TierFeatureList = ({ features, darkMode = false }: { features: Feature[]; darkMode?: boolean }) => {
  const textClasses = darkMode ? "text-gray-400" : "text-gray-500";
  const featureIconClasses = darkMode ? "text-green-400" : "text-green-500";

  return (<>
    <div className="text-left">
      <ul>
        {features.map((feature) => (
          <li key={feature.id} className="flex flex-row my-3">
            <CheckSquare className={featureIconClasses}/> &nbsp; {feature.name}
          </li>
        ))}
      </ul>
    </div>
  </>);
};

export default TierFeatureList;