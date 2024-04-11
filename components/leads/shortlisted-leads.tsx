'use client'

import { Lead } from "@prisma/client";
import { Badge, Bold, Button, Card, Text } from "@tremor/react";
import LeadItem, { LeadItemType } from "./lead-item";

export type ShortListedLead = {
    repo: {
        id: string;
        name: string;
        url: string | null;
    };
} & LeadItemType & Pick<Lead, 'maintainers'>;

export default function ShortlistedLeads({ leads }: { leads: ShortListedLead[]}) {
    return (
        <>
            {leads.map((lead: ShortListedLead, index: number) => (
                <Card className="flex flex-col my-2 z-0 relative">
                    <LeadItem lead={{...lead, maintainers: JSON.parse(lead.maintainers)}} />
                    <div className="flex flex-col absolute top-10 right-10">
                        
                        <Button
                            // loading={isAddingToShortlist}
                            // disabled={isShortlisted || isAddingToShortlist}
                            // onClick={() => addToShortlist(lead)} 
                        >Remove</Button>
                    </div>
                </Card>
            ))}
        </>
    )

}