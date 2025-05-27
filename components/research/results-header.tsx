"use client";
import type { FiltersState } from "@/types/lead";
import FilterBadges from "./filter-badges";
import Pagination from "./pagination";
import ResultsPerPage from "./results-per-page";

interface ResultsHeaderProps {
  page: number;
  perPage: number;
  totalCount: number;
  facets: any;
  isSearching: boolean;
  filters: FiltersState;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  onRemoveFilter: (key: string) => void;
}

export default function ResultsHeader({
  page,
  perPage,
  totalCount,
  facets,
  isSearching,
  filters,
  onPageChange,
  onPerPageChange,
  onRemoveFilter
}: ResultsHeaderProps) {
  return (
    <div className="sticky -top-1 z-10 -mx-1 flex flex-col items-stretch gap-4 rounded-md border bg-white p-4 shadow-sm">
      <div className="flex w-full items-start">
        <div className="flex w-1/2 flex-col items-start justify-between gap-4 lg:w-2/3 lg:flex-row lg:items-center">
          <Pagination
            page={page}
            perPage={perPage}
            totalCount={totalCount}
            facets={facets}
            onPageChange={onPageChange}
            isLoading={isSearching}
          />
        </div>

        <div className="flex w-1/2 items-center justify-end gap-3 lg:w-1/3">
          <ResultsPerPage perPage={perPage} isDisabled={isSearching} onChange={onPerPageChange} />
        </div>
      </div>
      <FilterBadges filters={filters} onRemoveFilter={onRemoveFilter} />
    </div>
  );
}
