"use client";

import { removeLeadFromShortlist } from "@/app/services/research-service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lead } from "@prisma/client";
import { useCallback, useState } from "react";
import ResearchItem from "./research-item";

export function ShortlistedResearch({ research: loadedResearch }: { research: Lead[] }) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [researchItems, setResearchItems] = useState<Lead[]>(loadedResearch);

  const removeResearchItem = useCallback(
    (itemId: string) => {
      setIsRemoving(true);
      removeLeadFromShortlist(itemId)
        .then(() => {
          setResearchItems((items) => items.filter((item) => item.id !== itemId));
        })
        .catch((error) => {
          console.error("Error removing research item from shortlist", error);
        })
        .finally(() => {
          setIsRemoving(false);
        });
    },
    [setResearchItems]
  );

  return (
    <>
      {researchItems.map((item: Lead, index: number) => (
        <Card className="relative z-0 my-2 flex flex-col" key={index}>
          <ResearchItem research={item} />
          <div className="absolute right-10 top-10 flex flex-col">
            <Button
              variant="outline"
              loading={isRemoving}
              loadingText="Removing"
              onClick={() => removeResearchItem(item.id)}
            >
              Remove
            </Button>
          </div>
        </Card>
      ))}
    </>
  );
}
