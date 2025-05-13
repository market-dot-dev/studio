"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface SimpleFeature {
  id: number;
  name: string;
}

export const TierDescriptionFeatures = ({
  features,
  darkMode = false
}: {
  features: SimpleFeature[];
  darkMode?: boolean;
}) => {
  const textClasses = darkMode ? "text-stone-300" : "text-stone-500";

  return (
    <ul className="flex flex-col gap-1 text-left">
      {features.map((feature) => (
        <li key={feature.id} className="flex gap-2 text-sm">
          <Check className={cn("size-5 min-w-6", darkMode ? "text-lime-400" : "text-success")} />
          <p className={cn("text-sm", textClasses)}>{feature.name}</p>
        </li>
      ))}
    </ul>
  );
};
