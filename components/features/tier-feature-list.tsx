"use client";

import { Feature } from "@prisma/client";
import {
  CheckSquare2 as CheckSquare,
} from "lucide-react";


const TierFeatureList = ({ features }: { features: Feature[] }) => {
  return (<>
    <div className="text-left">
      <ul>
        {features.map((feature) => (
          <li key={feature.id} className="flex flex-row my-3">
            <CheckSquare className="text-gray-500"/> &nbsp; {feature.name}
          </li>
        ))}
      </ul>
    </div>
  </>);
};

export default TierFeatureList;