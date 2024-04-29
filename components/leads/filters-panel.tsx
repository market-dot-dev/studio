'use client'

import { useEffect, useState } from "react";

type OptionType = {
  label: string;
  value: string;
}

type DataDictionary = {
  [key: string]: { [key: string]: number };
}

export type FiltersState = {
  country_code: string;
  state: string;
  industry: string;
  company_size: string;
  company_type: string;
  founded: string;
  city: string;
  kind: string;
}

export const emptyFilters: FiltersState = {
  country_code: '',
  state: '',
  industry: '',
  company_size: '',
  company_type: '',
  founded: '',
  city: '',
  kind: '',
}


export function hashFiltersState(filters: FiltersState): string {
  // Concatenate all values to form a single string
  const dataString = Object.values(filters).join('|');

  // Compute the hash
  let hash = 0;
  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }

  // Convert the hash to a hexadecimal string
  return hash.toString(16);
}

export default function FiltersPanel({facets, filters, setFilters, setItemsCount}: { facets: DataDictionary, filters: FiltersState, setFilters: React.Dispatch<React.SetStateAction<FiltersState>>, setItemsCount: React.Dispatch<React.SetStateAction<number>>}) {

  const handleCheckboxChange = (key: keyof FiltersState, value: string) => {

    const newFilters = { ...filters, [key]: filters[key] === value ? '' : value };
    
    // based on the new filters, find the minimum count of items
    let itemsCount = Infinity;

    Object.keys(newFilters).forEach((key) => {
      const facet = facets[key];
      const filterValue = newFilters[key as keyof FiltersState];
      
      if(filterValue && facet[filterValue] && facet[filterValue] < itemsCount) {
        itemsCount = facet[filterValue];
      }
    });
    
    setItemsCount(itemsCount);

    setFilters(newFilters);
  };

  const renderOptions = (key: keyof FiltersState) => {
    const options: OptionType[] = Object.entries(facets[key]).map(([value, count]) => ({
      label: `${value} (${count})`,
      value,
    }));
  
    // Add an "All" option with an empty value
    options.unshift({
      label: 'All',
      value: '',
    });
  
    if (options.length === 1 && options[0].value === '') return null; // Return null if only "All" option is available
  
    return (
      <div className="flex flex-col">
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-2">
            <input type="checkbox"
              checked={filters[key] === option.value}
              onChange={() => handleCheckboxChange(key, option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    );
  };

useEffect(() => {
  console.log(facets)
}, [facets])
  return (
    <div className="p-4 sticky top-[100px] z-50 overflow-auto" style={{maxHeight:"calc(100vh - 100px)"}}>
      <div className="flex flex-col gap-4">
        {Object.keys(facets).map((key) => {
          const options = renderOptions(key as keyof FiltersState);
          if (!options) return null; // Don't render the facet if no options available
          return (
            <div key={key}>
              <h3 className="text-lg font-semibold">{key}</h3>
              {options}
            </div>
          );
        })}
      </div>
    </div>
  );
};