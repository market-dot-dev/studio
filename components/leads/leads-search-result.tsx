import { addLeadToShortlist } from "@/app/services/LeadsService";
import { useCallback, useState } from "react";
import { LeadKey } from "./leads-search";
import { Badge, Button, Card } from "@tremor/react";
import LeadItem from "./lead-item";
import { Lead } from "@prisma/client";

export default function SearchResult({ lead, isShortlisted, setShortListedLeads }: { lead: Lead, isShortlisted: boolean, setShortListedLeads: any }) {
    const [isAddingToShortlist, setIsAddingToShortlist] = useState<boolean>(false);

    const addToShortlist = useCallback(() => {
        setIsAddingToShortlist(true);
        addLeadToShortlist(lead).then(() => {
            setShortListedLeads((prev: LeadKey[]) => [...prev, { host: lead.host, uuid: lead.uuid }]);
        }).catch((err: any) => {
            console.error('Failed to add to shortlist:', err);
        }).finally(() => {
            setIsAddingToShortlist(false);
        });
    }, [lead, setShortListedLeads]);

    return (
        <Card className="flex flex-col my-2 z-0 relative">
            <LeadItem lead={lead} />
            <div className="flex flex-col absolute right-10 gap-4">
                {isShortlisted && <Badge>Shortlisted</Badge>}
                <Button
                    loading={isAddingToShortlist}
                    disabled={isShortlisted || isAddingToShortlist}
                    onClick={addToShortlist}
                >Add to Shortlist</Button>
            </div>
        </Card>
    );
}