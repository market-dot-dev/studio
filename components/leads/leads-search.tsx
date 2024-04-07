'use client'
import { Repo } from "@prisma/client";
import { Bold, Card, Text, Badge, MultiSelect, MultiSelectItem } from "@tremor/react";
import mockData from "./mockdata"
import { useCallback, useState } from "react";
import { getDependentOwners } from "@/app/services/LeadsService";


type Lead = {
    id: number;
    host: string;
    login: string;
    name: string;
    uuid: string;
    kind: string;
    description: string | null;
    email: string | null;
    website: string | null;
    location: string | null;
    twitter: string | null;
    company: string | null;
    icon_url: string;
    repositories_count: number;
    last_synced_at: string;
    html_url: string;
    total_stars: number | null;
    dependent_repos_count: number;
    followers: number | null;
    following: number | null;
    created_at: string;
    updated_at: string;
    maintainers: string[];

}

export default function LeadsSearch({ repos }: { repos: Repo[] }) {

    const [leadsCache, setLeadsCache] = useState({} as Record<string, Lead[]>);
    const [selectedRepos, setSelectedRepos] = useState<string[]>([]);

    const fetchLeadDataForRepo = async (repoId : string) => {
        return await getDependentOwners(repoId);
    };

    const handleReposSelected = useCallback(async (selected: string[]) => {
        for (const repoId of selected) {
            if (!leadsCache[repoId]) {
                // If data for this repoId is not cached, fetch it and update the cache
                fetchLeadDataForRepo(repoId).then((fetchedLeads: Lead[]) => {
                    setLeadsCache((prev) => ({...prev, [repoId]: fetchedLeads}));
                });
            }
        }
        setSelectedRepos(selected);
    }, [leadsCache]);

    return (
        <>
            <div className="mb-4">
                <Bold>Search for a Repo:</Bold>
                { repos.length ?
                <MultiSelect onValueChange={handleReposSelected}>
                    {repos.map((repo, index) => (
                        <MultiSelectItem key={index} value={repo.repoId}>{repo.name}</MultiSelectItem>
                    ))}
                </MultiSelect>

                :
                    <Card
                        className="my-4 w-full bg-gray-100 border border-gray-400 px-4 py-3 text-gray-700"
                    >
                        <div className="mx-2 w-full">
                            <p className="font-semibold">No Connected Repositories</p>
                            <p>We recommend you connect some repositories in your <a href="/settings/repos" className="underline">Repo Settings</a>.</p>
                        </div>
                    </Card>
                }

            </div>

            <Bold>Organizations Using This Repository</Bold>

             {/* {displayedLeads.map((lead, index) => (
                <Card key={index} className="flex flex-col my-2">
                    <Badge>{repo}</Badge>
                    <div>
                        <Bold>{lead.name}</Bold>
                        <Badge>Organization</Badge>
                    </div>
                    <Text>{lead.description}</Text>
                    <Text>Dependent Repositories: {lead.dependent_repos_count}</Text>
                    <Text>Total Repositories: {lead.repositories_count}</Text>
                    <Text>Website: {lead.website}</Text>
                    <Text>Email: {lead.email}</Text>
                    <Text>Twitter: {lead.twitter}</Text>
                    <Text>Location: {lead.location}</Text>
                    <Text>Company: {lead.company}</Text>
                    <Text>Maintainers: {lead.maintainers.join(', ')}</Text>
                </Card>
            ))} */}

            { selectedRepos.map((repoId, cacheIndex) => {
                const repo = repos.find(repo => repo.repoId === repoId);
                return (<div key={cacheIndex}>
                        { leadsCache[repoId]?.map((lead, index) => (
                            <Card key={index} className="flex flex-col my-2">
                                <Badge>{repo?.name}</Badge>
                                <div>
                                    <Bold>{lead.name}</Bold>
                                    <Badge>Organization</Badge>
                                </div>
                                <Text>{lead.description}</Text>
                                <Text>Dependent Repositories: {lead.dependent_repos_count}</Text>
                                <Text>Total Repositories: {lead.repositories_count}</Text>
                                <Text>Website: {lead.website}</Text>
                                <Text>Email: {lead.email}</Text>
                                <Text>Twitter: {lead.twitter}</Text>
                                <Text>Location: {lead.location}</Text>
                                <Text>Company: {lead.company}</Text>
                                <Text>Maintainers: {lead.maintainers.join(', ')}</Text>
                            </Card>
                        ))}
                    </div>)
            })}
        </>
    )
}