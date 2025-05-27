"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import countryCodes from "@/lib/constants/country-codes";
import type { FiltersState } from "@/types/lead";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useEffect, useState, type JSX } from "react";

type OptionType = {
  label: string;
  value: string;
  count: number;
};

type DataDictionary = {
  [key: string]: { [key: string]: number };
};

export const emptyFilters: FiltersState = {
  country_code: "",
  state: "",
  industry: "",
  size: "",
  company_type: "",
  founded: "",
  city: "",
  kind: ""
};

export const filtersMeta = {
  kind: {
    key: "kind",
    label: "Type of Entity"
  },
  industry: {
    key: "industry",
    label: "Industry"
  },
  company_size: {
    key: "size",
    label: "Company Size"
  },
  company_type: {
    key: "company_type",
    label: "Company Type"
  },
  founded: {
    key: "founded",
    label: "Founded in",
    disabled: true
  },
  city: {
    key: "city",
    label: "City",
    disabled: true
  },
  state: {
    key: "state",
    label: "State",
    disabled: true
  },
  country_code: {
    key: "country_code",
    label: "Country"
  }
} as any;

const filtersToFacetMap = {
  kind: "kind",
  industry: "industry",
  size: "company_size",
  company_type: "company_type",
  founded: "founded",
  city: "city",
  state: "state",
  country_code: "country_code"
} as any;

export function hashFiltersState(filters: FiltersState): string {
  // Concatenate all values to form a single string
  const dataString = Object.values(filters).join("|");

  // Compute the hash
  let hash = 0;
  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }

  // Convert the hash to a hexadecimal string
  return hash.toString(16);
}

function FacetItem({ title, options }: { title: string; options: JSX.Element }) {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // const isCountry = title === "country_code";

  const displayTitle = filtersMeta[title]?.label ?? title;
  // isCountry ? "Country" : title.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Converts to title case

  return (
    <div className="mb-4 flex flex-col gap-3 border border-x-0 border-t-0 pb-2">
      <h3
        className="text-md mb-2 flex cursor-pointer items-center justify-between font-semibold"
        onClick={toggleCollapse}
      >
        {displayTitle}
        {collapsed ? (
          <ChevronDown className="size-5 shrink-0" aria-hidden="true" />
        ) : (
          <ChevronUp className="size-5 shrink-0" aria-hidden="true" />
        )}
      </h3>
      {!collapsed && <>{options}</>}
    </div>
  );
}

function debounce(func: any, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function OptionsList({
  options,
  filters,
  handleCheckboxChange,
  filterName
}: {
  options: OptionType[];
  filters: FiltersState;
  handleCheckboxChange: (key: keyof FiltersState, value: string) => void;
  filterName: keyof FiltersState;
}) {
  const [collapsed, setCollapsed] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determine visible options based on collapsed state and the filtered list
  const visibleOptions = collapsed ? filteredOptions.slice(0, 8) : filteredOptions;

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const itemKey = filtersMeta[filterName]?.key ?? filterName;

  return (
    <div className="flex flex-col gap-2">
      {options.length > 8 && (
        <Input
          placeholder="Search..."
          onChange={(e) => debouncedSearch(e.target.value)}
          className="mb-2"
        />
      )}
      {visibleOptions.map((option) => {
        return (
          <div key={option.value} className="mb-1 flex w-full items-center justify-between">
            <Checkbox
              id={`${filterName}-${option.value}`}
              checked={filters[itemKey as keyof FiltersState] === option.value}
              onCheckedChange={() => handleCheckboxChange(itemKey, option.value)}
              label={option.label[0].toUpperCase() + option.label.substring(1)}
            />
            <span className="pr-2 text-sm text-gray-400">{option.count}</span>
          </div>
        );
      })}
      {filteredOptions.length > 8 && (
        <button
          className="flex cursor-pointer items-center justify-center text-sm text-blue-600"
          onClick={toggleCollapse}
        >
          {collapsed ? (
            <ChevronDown className="mr-2 size-5" aria-hidden="true" />
          ) : (
            <ChevronUp className="mr-2 size-5" aria-hidden="true" />
          )}
          {collapsed ? "More" : "Less"}
        </button>
      )}
    </div>
  );
}

export default function FiltersPanel({
  facets,
  filters,
  setFilters,
  setItemsCount
}: {
  facets: DataDictionary;
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  setItemsCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  const determineItemsCount = useCallback(() => {
    // Default to 0 if we can't determine the count
    if (!facets || typeof facets !== "object") {
      setItemsCount(0);
      return;
    }

    // Get the count of organizations and users, defaulting to 0 if they don't exist
    const orgCount =
      facets["kind"] && facets["kind"]["organization"] ? facets["kind"]["organization"] : 0;
    const userCount = facets["kind"] && facets["kind"]["user"] ? facets["kind"]["user"] : 0;
    let itemsCount = orgCount + userCount;

    Object.keys(filters).forEach((filterName) => {
      const key = filtersToFacetMap[filterName] ?? filterName;

      // Check if this facet exists
      if (!facets[key]) return;

      const facet = facets[key];
      const filterValue = filters[key as keyof FiltersState];

      if (filterValue && facet[filterValue] !== undefined && facet[filterValue] < itemsCount) {
        itemsCount = facet[filterValue];
      }
    });

    setItemsCount(itemsCount);
  }, [facets, filters, setItemsCount]);

  const handleCheckboxChange = useCallback(
    (filterName: keyof FiltersState, value: string) => {
      const key = filtersMeta[filterName]?.key ?? filterName;
      const newFilters = {
        ...filters,
        [key]: filters[key as keyof FiltersState] === value ? "" : value
      };

      setFilters(newFilters);
    },
    [facets, filters, setFilters, setItemsCount]
  );

  const renderOptions = (filterName: keyof FiltersState) => {
    if (filtersMeta[filterName]?.disabled) return null; // Hides disabled filter panels

    // Check if facets exists and has this filter
    if (!facets || !facets[filterName]) return null;

    const isCountry = filterName === "country_code";

    // Make sure we have an object to iterate over
    const facetData = facets[filterName] || {};

    const options: OptionType[] = Object.entries(facetData).map(([value, count]) => ({
      label: `${isCountry ? (countryCodes[value] ?? value) : value}`,
      value,
      count: typeof count === "number" ? count : 0
    }));

    if (!options.length) return null; // Return null if no options available

    return (
      <OptionsList
        filterName={filterName}
        options={options}
        filters={filters}
        handleCheckboxChange={handleCheckboxChange}
      />
    );
  };

  useEffect(() => {
    if (!facets) return;
    determineItemsCount();
  }, [filters, facets, determineItemsCount]);

  return (
    <div className="p-4">
      <div className="flex flex-col gap-1">
        {Object.keys(facets).map((key) => {
          const options = renderOptions(key as keyof FiltersState);
          if (!options) return null; // Don't render the facet if no options available
          return <FacetItem key={key} title={key} options={options} />;
        })}
      </div>
    </div>
  );
}
