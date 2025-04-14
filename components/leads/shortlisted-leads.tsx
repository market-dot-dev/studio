"use client";

import { removeLeadFromShortlist } from "@/app/services/LeadsService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lead } from "@prisma/client";
import { useCallback, useState } from "react";
import LeadItem from "./lead-item";

// export type ShortListedLead = {
//     // repo: {
//     //     id: string;
//     //     name: string;
//     //     url: string | null;
//     // };
// } & Lead;

export default function ShortlistedLeads({ leads: loadedLeads }: { leads: Lead[] }) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(loadedLeads);

  const removeLead = useCallback(
    (leadId: number) => {
      setIsRemoving(true);
      removeLeadFromShortlist(leadId)
        .then(() => {
          setLeads((leads) => leads.filter((lead) => lead.id !== leadId));
        })
        .catch((error) => {
          console.error("Error removing lead from shortlist", error);
        })
        .finally(() => {
          setIsRemoving(false);
        });
    },
    [setLeads]
  );

  return (
    <>
      {leads.map((lead: Lead, index: number) => (
        <Card className="relative z-0 my-2 flex flex-col" key={index}>
          <LeadItem lead={lead} />
          <div className="absolute right-10 top-10 flex flex-col">
            <Button
              variant="outline"
              loading={isRemoving}
              loadingText="Removing"
              onClick={() => removeLead(lead.id)}
            >
              Remove
            </Button>
          </div>
        </Card>
      ))}
    </>
  );
}
