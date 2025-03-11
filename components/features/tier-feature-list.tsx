"use client";

import { Feature } from "@prisma/client";
import { Check } from "lucide-react";
import clsx from "clsx";
import { cn } from "@/lib/utils";

const TierFeatureList = ({
  features,
  darkMode = false,
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
              className="h-5 w-5 min-w-6 text-swamp"
            />
            <p className={cn("text-sm", textClasses)}>{feature.name}</p>
          </li>
        ))}
    </ul>
  );
};

export default TierFeatureList;
