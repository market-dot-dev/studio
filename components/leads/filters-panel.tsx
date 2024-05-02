'use client'

import { useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TextInput } from "@tremor/react"
import countryCodes from "@/lib/constants/country-codes" ;

type OptionType = {
  label: string;
  value: string;
  count: number;
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

function FacetItem({title, options}: {title: string, options: JSX.Element}) {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const isCountry = title === "country_code";

  const displayTitle = isCountry ? "Country" : title.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Converts to title case
  
  return (
    <div className="mb-4 flex flex-col gap-3 border border-x-0 border-t-0 pb-2">
      <h3 className="font-semibold text-md mb-2 cursor-pointer flex justify-between items-center" onClick={toggleCollapse}>
        {displayTitle}
        { collapsed ? 
        <ChevronDown className="h-5 w-5 flex-shrink-0" aria-hidden="true" /> :
        <ChevronUp className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
        }
      </h3>
      {!collapsed &&
        <>
        {options}
        </>
      }
    </div>
  );
}

function debounce(func: any, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args : any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function OptionsList({options, filters, handleCheckboxChange, itemKey}: {options: OptionType[], filters: FiltersState, handleCheckboxChange: (key: keyof FiltersState, value: string) => void, itemKey: keyof FiltersState}) {
  const [collapsed, setCollapsed] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useCallback(debounce((value: string) => {
    setSearchTerm(value);
  }, 300), []);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determine visible options based on collapsed state and the filtered list
  const visibleOptions = collapsed ? filteredOptions.slice(0, 8) : filteredOptions;

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex flex-col gap-2">
      {options.length > 8 && (
        <TextInput
          
          placeholder="Search..."
          onChange={(e) => debouncedSearch(e.target.value)}
          className="mb-2"
        />
      )}
      {visibleOptions.map((option) => (
        <div key={option.value} className="mb-1 flex justify-between w-full items-center">
          <label className="flex items-center space-x-2 text-sm grow">
            <input type="checkbox"
              checked={filters[itemKey] === option.value}
              onChange={() => handleCheckboxChange(itemKey, option.value)}
            />
            <span>{option.label[0].toUpperCase() + option.label.substring(1)}</span>
          </label>
          <span className="text-sm text-gray-400 pr-2">{option.count}</span>
        </div>
      ))}
      {filteredOptions.length > 8 && (
        <div className="cursor-pointer text-blue-600 flex justify-center items-center text-sm" onClick={toggleCollapse}>
          {collapsed ? 
            <ChevronDown className="h-5 w-5 mr-2" aria-hidden="true" />
            : <ChevronUp className="h-5 w-5 mr-2" aria-hidden="true" />
          }
          {collapsed ? "More" : "Less"}
        </div>
      )}
    </div>
  );
}


export default function FiltersPanel({facets, filters, setFilters, setItemsCount}: { facets: DataDictionary, filters: FiltersState, setFilters: React.Dispatch<React.SetStateAction<FiltersState>>, setItemsCount: React.Dispatch<React.SetStateAction<number>>}) {


  const determineItemsCount = useCallback(() => {
    let itemsCount = facets['kind']['organization'] + facets['kind']['user'];
    
    Object.keys(filters).forEach((key) => {
      const facet = facets[key];
      const filterValue = filters[key as keyof FiltersState];
    
      if(filterValue && facet[filterValue] && facet[filterValue] < itemsCount) {
        itemsCount = facet[filterValue];
      }
    });
    
    setItemsCount(itemsCount);
  }, [facets, filters, setItemsCount]);

  const handleCheckboxChange = useCallback((key: keyof FiltersState, value: string) => {

    const newFilters = { ...filters, [key]: filters[key] === value ? '' : value };

    setFilters(newFilters);
  }, [facets, filters, setFilters, setItemsCount]);

  const renderOptions = (itemKey: keyof FiltersState) => {
    if (['founded', 'city', 'state'].includes(itemKey)) return null; // Hides specified filter panels

    const isCountry = itemKey === "country_code";

    const options: OptionType[] = Object.entries(facets[itemKey]).map(([value, count]) => ({
      label: `${ isCountry ? countryCodes[value] ?? value : value }`,
      value,
      count,
    }));
    
    if ( ! options.length ) return null; // Return null if only "All" option is available
  
    return (
      <OptionsList
        itemKey={itemKey}
        options={options}
        filters={filters}
        handleCheckboxChange={handleCheckboxChange}
        />
    );
  };

  useEffect(() => {
    if( ! facets ) return;
    determineItemsCount();
  }, [filters, facets, determineItemsCount])

  return (
    <div className="p-4">
      <div className="flex flex-col gap-1">
        {Object.keys(facets).map((key) => {
          const options = renderOptions(key as keyof FiltersState);
          if (!options) return null; // Don't render the facet if no options available
          return (
            <FacetItem key={key} title={key} options={options} />
          );
        })}
      </div>
    </div>
  );
}