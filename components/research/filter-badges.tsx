"use client";
import { type FiltersState } from "@/app/services/LeadsService";
import { Badge } from "@/components/ui/badge";
import { XCircle } from "lucide-react";

interface FilterBadgesProps {
  filters: FiltersState;
  onRemoveFilter: (key: string) => void;
}

export default function FilterBadges({ filters, onRemoveFilter }: FilterBadgesProps) {
  const filterBadges = Object.keys(filters || {})
    .map((key: string) => {
      if (filters && filters[key as keyof FiltersState]) {
        return (
          <Badge key={key} variant="secondary" className="mb-1 mr-1 pr-1">
            <div className="flex flex-nowrap gap-1">
              <p className="text-sm text-stone-500">
                {key}: {filters[key as keyof FiltersState]}
              </p>
              <button onClick={() => onRemoveFilter(key)}>
                <XCircle className="size-5 shrink-0" />
              </button>
            </div>
          </Badge>
        );
      }
      return null;
    })
    .filter(Boolean);

  return filterBadges.length ? <div>{filterBadges}</div> : null;
}
