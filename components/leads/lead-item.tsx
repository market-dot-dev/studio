import { Badge, Text, Bold, Button } from "@tremor/react";
import { useState } from "react";

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

function getDependencyBadge(dependentReposCount: number) {
    return dependentReposCount > 5 ? "High Dependency" : "Low Dependency";
}

function getWebsiteBadge(website: string) {
    // Ensure website starts with http:// or https://
    if (!website.startsWith('http://') && !website.startsWith('https://')) {
        website = 'http://' + website;
    }

    try {
        const domain = new URL(website).hostname.split('.').pop();
        switch (domain) {
            case 'edu':
                return 'Educational';
            case 'org':
                return 'Non-profit';
            default:
                return 'Commercial';
        }
    } catch (error) {
        console.error("Error parsing URL:", error);
        return 'Invalid URL'; // You can choose to return a specific badge for invalid URLs
    }
}


export default function LeadItem({ lead }: { lead: LeadItemType }) {
    const [showAllMaintainers, setShowAllMaintainers] = useState(false);

    const toggleMaintainers = () => {
        setShowAllMaintainers(!showAllMaintainers);
    };

    const visibleMaintainers = showAllMaintainers ? lead.maintainers : lead.maintainers.slice(0, 10);

    return (
        <>
            <div className="flex flex-row gap-8 mb-2">
                <div>
                    <img src={lead.icon_url} width={100} />
                </div>
                <div className="flex flex-col">
                    <div className="flex gap-4">
                        <Badge>{lead.kind && lead.kind.charAt(0).toUpperCase() + lead.kind.slice(1)}</Badge>
                        <Badge>{getDependencyBadge(lead.dependent_repos_count)}</Badge>
                        { lead.website ? <Badge>{getWebsiteBadge(lead.website)}</Badge> : null }
                    </div>
                    <Bold>{lead.name}</Bold>
                    <Text>{lead.description}</Text>
                    <Text><a href={lead.html_url} target="_blank" className="underline">{lead.html_url}</a></Text>
                </div>
            </div>

            <Text>Dependent Repositories: {lead.dependent_repos_count}</Text>
            <Text>Total Repositories: {lead.repositories_count}</Text>

            <Bold>Contact Information</Bold>
            <Text>Website: {lead.website}</Text>
            <Text>Email: {lead.email}</Text>
            <Text>Twitter: {lead.twitter}</Text>
            <Text>Location: {lead.location}</Text>
            <Text>Company: {lead.company}</Text>

            <div className="flex gap-2 mb-2 items-start">
                <Text>Maintainers: </Text>
                <div className="flex gap-2 flex-wrap items-center">
                    {visibleMaintainers.map(maintainer => <Badge key={maintainer}>{maintainer}</Badge>)}
                    {lead.maintainers.length > 10 && (
                        <Button size="xs" variant="light" onClick={toggleMaintainers}>
                            {showAllMaintainers ? 'Hide' : 'Show More...'}
                        </Button>
                    )}
                </div>
            </div>

            
        </>
    );
}