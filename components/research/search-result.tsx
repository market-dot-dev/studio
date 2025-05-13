"use client";
import { addLeadToShortlist } from "@/app/services/research-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCallback, useState } from "react";
import ResearchItem from "./research-item";

type ResearchKey = {
  host: string;
  uuid: string;
};

interface SearchResultProps {
  research: any;
  isShortlisted: boolean;
  setShortListedResearch: React.Dispatch<React.SetStateAction<ResearchKey[]>>;
}

export default function SearchResult({
  research,
  isShortlisted,
  setShortListedResearch
}: SearchResultProps) {
  const [isAddingToShortlist, setIsAddingToShortlist] = useState<boolean>(false);

  const addToShortlist = useCallback(() => {
    setIsAddingToShortlist(true);
    addLeadToShortlist(research)
      .then(() => {
        setShortListedResearch((prev: ResearchKey[]) => [
          ...prev,
          { host: research.host, uuid: research.uuid }
        ]);
      })
      .catch((err: any) => {
        console.error("Failed to add to shortlist:", err);
      })
      .finally(() => {
        setIsAddingToShortlist(false);
      });
  }, [research, setShortListedResearch]);

  return (
    <Card className="relative z-0 my-2 flex flex-col">
      <ResearchItem research={research} />
      <div className="absolute right-10 flex flex-col gap-4">
        {isShortlisted && <Badge variant="secondary">Shortlisted</Badge>}
        <Button
          variant="outline"
          loading={isAddingToShortlist}
          loadingText="Adding to Shortlist"
          disabled={isShortlisted || isAddingToShortlist}
          onClick={addToShortlist}
        >
          Add to Shortlist
        </Button>
      </div>
    </Card>
  );
}
