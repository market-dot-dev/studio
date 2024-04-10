'use client'

import { Lead } from "@prisma/client";
import { Badge, Bold, Button, Card, Text } from "@tremor/react";

export type ShortListedLead = {
    repo: {
        id: string;
        name: string;
        url: string | null;
    };
} & Lead;

export default function ShortlistedLeads({ leads }: { leads: ShortListedLead[]}) {
    return (
        <div>
            {leads.map((lead: ShortListedLead, index: number) => (
                <Card key={index} className="flex flex-col my-2 relative">
                <Badge>{lead?.repo?.name}</Badge>
                <div>
                    <Bold>{lead.name}</Bold>
                    <Badge>Organization</Badge>
                </div>
                <Text>{lead.description}</Text>
                <Text>Dependent Repositories: {lead.dependentReposCount}</Text>
                <Text>Total Repositories: {lead.repositoriesCount}</Text>
                <Text>Website: {lead.website}</Text>
                <Text>Email: {lead.email}</Text>
                <Text>Twitter: {lead.twitter}</Text>
                <Text>Location: {lead.location}</Text>
                <Text>Company: {lead.company}</Text>
                <Text>Maintainers: {JSON.parse(lead.maintainers ?? []).join(', ')}</Text>
            </Card>
            ))}
        </div>
    )

}