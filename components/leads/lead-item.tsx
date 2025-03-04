import { Lead } from "@prisma/client";
import { Badge, Button, ProgressCircle } from "@tremor/react";
import { useState } from "react";
import Link from "next/link";

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

    const formattedWebsite = lead.website ? !lead.website.startsWith('http://') && !lead.website.startsWith('https://') 
        ? 'http://' + lead.website 
        : lead.website : null;
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
                    <strong>{lead.name}</strong>
                    <p className="text-sm text-stone-500">{lead.description}</p>
                    <p className="text-sm text-stone-500"><a href={lead.html_url} target="_blank" className="underline">{lead.html_url}</a></p>
                </div>
            </div>
            <div className="flex flex-row gap-8 my-4">
                <div className="w-1/2">
                    <strong>Contact Information</strong>
                    <p className="text-sm text-stone-500">Website: {formattedWebsite ? <a href={formattedWebsite} target="_blank" rel="noopener noreferrer" className="underline">{formattedWebsite}</a> : null }</p>
                    <p className="text-sm text-stone-500">Email: {lead.email ? <a href={`mailto:${lead.email}`} className="underline">{lead.email}</a> : null }</p>
                    <p className="text-sm text-stone-500">Twitter: {lead.twitter}</p>
                    <p className="text-sm text-stone-500">Location: {lead.location}</p>
                    { lead.kind && 'organization' !== lead.kind.toLowerCase() && <p className="text-sm text-stone-500">Company: {lead.company}</p> }
                </div>

                <div className="flex w-1/2 justify-start">
                    <div>
                        <div>
                            <div className="flex gap-2 items-center mb-3">
                                <strong>Dependency:</strong>
                                <Badge>{getDependencyScoreBadge(lead.dependent_repos_count)}</Badge>
                            </div>

                            <div className="flex gap-2 items-center">
                                <ProgressCircle color="blue" value={dependencyPercentage} size="sm">
                                    <span className="text-xs font-medium text-slate-700">{dependencyPercentage}%</span>
                                </ProgressCircle>
                                <p className="text-sm text-stone-500">Used by <b>{lead.dependent_repos_count} of {lead.repositories_count}</b> repositories.</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-2 mb-2 items-start pt-2">
                <p className="text-sm text-stone-500">Maintainers: </p>
                <div className="flex gap-2 flex-wrap items-center">
                    { (lead.maintainers as []).length === 0 ? 
                        <p className="text-sm text-stone-500">No maintainers found</p>
                        :
                        <>
                        {visibleMaintainers.map((maintainer: string) => <Badge key={maintainer}><Link href={`https://www.github.com/`+maintainer+`/`} target="_blank">{maintainer}</Link></Badge>)}
                        {(lead.maintainers as [])?.length > 10 && (
                            <Button size="xs" variant="light" onClick={toggleMaintainers}>
                                {showAllMaintainers ? 'Hide' : 'Show More...'}
                            </Button>
                        )}
                        </>
                }
                </div>
            </div>


        </>
    );
}