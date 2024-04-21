'use client'

import { Lead } from "@prisma/client";
import { Button, Card } from "@tremor/react";
import LeadItem from "./lead-item";
import { useCallback, useState } from "react";
import { removeLeadFromShortlist } from "@/app/services/LeadsService";

// export type ShortListedLead = {
//     // repo: {
//     //     id: string;
//     //     name: string;
//     //     url: string | null;
//     // };
// } & Lead;

export default function ShortlistedLeads({ leads : loadedLeads }: { leads: Lead[]}) {
    const [isRemoving, setIsRemoving] = useState(false);
    const [leads, setLeads] = useState<Lead[]>(loadedLeads);

    const removeLead = useCallback((leadId: number) => {
        setIsRemoving(true);
        removeLeadFromShortlist(leadId).then(() => {
            setLeads((leads) => leads.filter(lead => lead.id !== leadId));
        })
        .catch((error) => {
            console.error("Error removing lead from shortlist", error);
        })
        .finally(() => {
            setIsRemoving(false);
        });
        
    }, [setLeads])
    
    return (
        <>
            {leads.map((lead: Lead, index: number) => (
                <Card className="flex flex-col my-2 z-0 relative" key={index}>
                    <LeadItem lead={lead} />
                    <div className="flex flex-col absolute top-10 right-10">
                        
                        <Button
                            loading={isRemoving}
                            disabled={isRemoving}
                            onClick={() => removeLead(lead.id)} 
                        >Remove</Button>
                    </div>
                </Card>
            ))}
        </>
    )

}