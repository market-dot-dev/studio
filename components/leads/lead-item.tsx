import { Badge, Text, Bold } from "@tremor/react";

export type LeadItemType = {
    id: number;
    host: string;
    login: string;
    name: string;
    uuid: string;
    kind: string;
    description: null | string;
    email: string;
    website: null | string;
    location: null | string;
    twitter: null | string;
    company: null | string;
    icon_url: string;
    repositories_count: number;
    last_synced_at: string;
    html_url: string;
    total_stars: number;
    dependent_repos_count: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
    maintainers: any[]; 
}

export default function LeadItem( { lead }: {lead : LeadItemType}) {
    return (
        <>
        <div className="flex flex-row gap-8 mb-2">
                <div>
                    <img src={lead.icon_url} width={100} />
                </div>
                <div className="flex flex-col">
                    <Badge>{lead.kind && lead.kind.charAt(0).toUpperCase() + lead.kind.slice(1)}</Badge>
                    <Bold>{lead.name}</Bold>
                    <Text>{lead.description}</Text>
                    <Text><a href={lead.html_url} target="_blank" className="underline">{lead.html_url}</a></Text>
                </div>
            </div>
            <Bold>Dependency: <span className="text-red">High</span></Bold>

            <Text>Dependent Repositories: {lead.dependent_repos_count}</Text>
            <Text>Total Repositories: {lead.repositories_count}</Text>

            <Bold>Contact Information</Bold>
            <Text>Website: {lead.website}</Text>
            <Text>Email: {lead.email}</Text>
            <Text>Twitter: {lead.twitter}</Text>
            <Text>Location: {lead.location}</Text>
            <Text>Company: {lead.company}</Text>
            <Text>Maintainers: {lead.maintainers.join(', ')}</Text>
        </>
    )
}