"use client";
import type { ResearchKey } from "@/types/research";
import { SearchResult } from "./search-result";

interface ResearchResultsProps {
  results: any[];
  shortListedResearch: ResearchKey[];
  setShortListedResearch: React.Dispatch<React.SetStateAction<ResearchKey[]>>;
}

export default function ResearchResults({
  results,
  shortListedResearch,
  setShortListedResearch
}: ResearchResultsProps) {
  if (!Array.isArray(results) || results.length === 0) {
    return null;
  }

  return (
    <>
      {results.map((researchItem, index) => {
        const isShortlisted =
          Array.isArray(shortListedResearch) &&
          shortListedResearch.some(
            (researchKey) =>
              researchKey.host === researchItem.host && researchKey.uuid === researchItem.uuid
          );

        return (
          <SearchResult
            key={index}
            research={researchItem}
            isShortlisted={isShortlisted}
            setShortListedResearch={setShortListedResearch}
          />
        );
      })}
    </>
  );
}
