import { Lead } from "@prisma/client";
import { Badge, Text, Bold, Button } from "@tremor/react";
import { useState } from "react";
import { ProgressCircle } from '@tremor/react';


function getDependencyScoreBadge(dependentReposCount: number) {
    return dependentReposCount > 5 ? "High" : "Low";
}

function getWebsiteBadge(website: string) {
    // Ensure website starts with http:// or https://
    if (!website.startsWith('http://') && !website.startsWith('https://')) {
        website = 'http://' + website;
    }

    try {
        const domain = new URL(website).hostname.split('.').pop();
        switch (domain) {
            case 'com':
                return 'Company';
            case 'edu':
                return 'Educational';
            case 'org':
                return 'Non-profit';
            default:
                return;
        }
    } catch (error) {
        console.error("Error parsing URL:", error);
        return 'Invalid URL'; // You can choose to return a specific badge for invalid URLs
    }
}


export default function LeadItem({ lead }: { lead: Lead }) {
    const [showAllMaintainers, setShowAllMaintainers] = useState(false);

    const toggleMaintainers = () => {
        setShowAllMaintainers(!showAllMaintainers);
    };

    const visibleMaintainers = showAllMaintainers ? lead.maintainers as [] : (lead.maintainers as []).slice(0, 10);
    const dependencyPercentage = Math.round((lead.dependent_repos_count / lead.repositories_count) * 100);
    return (
        <>

            <div className="flex flex-row gap-8 mb-2">
                {lead.icon_url ? <div>
                    <img src={lead.icon_url} width={100} />
                </div>
                    : null}
                <div className="flex flex-col">
                    <div className="flex gap-4">
                        <Badge>{lead.kind && lead.kind.charAt(0).toUpperCase() + lead.kind.slice(1)}</Badge>
                    </div>
                    <Bold>{lead.name}</Bold>
                    <Text>{lead.description}</Text>
                    <Text><a href={lead.html_url} target="_blank" className="underline">{lead.html_url}</a></Text>
                </div>
            </div>
            <div className="flex flex-row gap-8 my-4">
                <div className="w-1/2">
                    <Bold>Contact Information</Bold>
                    <Text>Website: {lead.website}</Text>
                    <Text>Email: {lead.email}</Text>
                    <Text>Twitter: {lead.twitter}</Text>
                    <Text>Location: {lead.location}</Text>
                    <Text>Company: {lead.company}</Text>
                </div>

                <div className="flex w-1/2 justify-start my-2">
                    <div className="p-4 border-2 rounded-xl bg-gray h-full">
                        <div>
                            <p className="flex gap-2 items-center mb-3">
                                <Bold>Dependency:</Bold>
                                <Badge>{getDependencyScoreBadge(lead.dependent_repos_count)}</Badge>
                            </p>

                            <div className="flex gap-2 items-center">
                                <ProgressCircle color="blue" value={dependencyPercentage} size="sm">
                                    <span className="text-xs font-medium text-slate-700">{dependencyPercentage}%</span>
                                </ProgressCircle>
                                <Text>Used by <b>{lead.dependent_repos_count} of {lead.repositories_count}</b> repositories.</Text>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-2 mb-2 items-start pt-2">
                <Text>Maintainers: </Text>
                <div className="flex gap-2 flex-wrap items-center">
                    {visibleMaintainers.map((maintainer: string) => <Badge key={maintainer}>{maintainer}</Badge>)}
                    {(lead.maintainers as [])?.length > 10 && (
                        <Button size="xs" variant="light" onClick={toggleMaintainers}>
                            {showAllMaintainers ? 'Hide' : 'Show More...'}
                        </Button>
                    )}
                </div>
            </div>


        </>
    );
}