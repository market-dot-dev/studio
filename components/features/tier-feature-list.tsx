"use client";

import { Feature } from "@prisma/client";
import { Check } from "lucide-react";
import clsx from "clsx";

const TierFeatureList = ({ features, darkMode = false }: { features: Partial<Feature>[]; darkMode?: boolean }) => {
  return (
    <ul className="flex flex-col gap-1 text-left">
      {features
        .filter((f) => f.isEnabled)
        .map((feature) => (
          <li key={feature.id} className="flex gap-2 text-sm">
            <Check
              className={clsx(
                "h-5 w-5 min-w-6",
                darkMode ? "text-emerald-400" : "text-emerald-600",
              )}
            />
            <p className="text-gray-500">{feature.name}</p>
          </li>
        ))}
    </ul>
  );
};

export default TierFeatureList;