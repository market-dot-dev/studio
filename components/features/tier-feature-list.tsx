"use client";

import { cn } from "@/lib/utils";
import { Feature } from "@prisma/client";
import { Check } from "lucide-react";

const TierFeatureList = ({
  features,
  darkMode = false
}: {
  features: Partial<Feature>[];
  darkMode?: boolean;
}) => {
  const textClasses = darkMode ? "text-stone-300" : "text-stone-500";

  return (
    <ul className="flex flex-col gap-1 text-left">
      {features
        .filter((f) => f.isEnabled)
        .map((feature) => (
          <li key={feature.id} className="flex gap-2 text-sm">
            <Check
              className={cn("h-5 w-5 min-w-6", darkMode ? "text-lime-400" : "text-lime-600")}
            />
            <p className={cn("text-sm", textClasses)}>{feature.name}</p>
          </li>
        ))}
    </ul>
  );
};

export default TierFeatureList;
