"use client";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";

interface PaginationProps {
  page: number;
  perPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  facets: any;
}

export default function Pagination({
  page,
  perPage,
  totalCount,
  onPageChange,
  isLoading,
  facets
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage)); // Ensure at least 1 page
  const [inputPage, setInputPage] = useState<number>(page);

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const handleGoClick = useCallback(() => {
    if (!isNaN(inputPage) && inputPage !== page) {
      changePage(inputPage);
    }
  }, [page, inputPage]);

  useEffect(() => {
    setInputPage(page);
  }, [page]);

  return (
    <>
      <div className="flex items-center justify-start gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => changePage(page - 1)}
          disabled={page === 1 || isLoading}
        >
          Prev
        </Button>
        <span className="text-sm">
          Page {page} of {facets && typeof facets === "object" ? totalPages : "-"}
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => changePage(page + 1)}
          disabled={page === totalPages || isLoading || !facets}
        >
          Next
        </Button>
      </div>
      <div className="flex grow items-center justify-end gap-2 lg:justify-center">
        <input
          type="number"
          min={1}
          max={totalPages}
          value={inputPage}
          onChange={(e) => {
            setInputPage(e.target.valueAsNumber);
          }}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
              handleGoClick();
            }
          }}
          className="w-20 rounded-md border border-gray-300 text-xs"
          placeholder="Go to page..."
        />

        <Button size="sm" disabled={isLoading} onClick={handleGoClick}>
          Go to Page
        </Button>
      </div>
    </>
  );
}
