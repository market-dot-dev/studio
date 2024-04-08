'use client'
import { Lead, Repo } from "@prisma/client";
import { Bold, Card, Text, Badge, MultiSelect, MultiSelectItem } from "@tremor/react";

import { useCallback, useState } from "react";

import { getRepoLeads } from "@/app/services/RepoService";


export default function LeadsSearch({ repos }: { repos: Repo[] }) {
    
    const [leadsCache, setLeadsCache] = useState({} as Record<string, Lead[]>);
    const [selectedRepos, setSelectedRepos] = useState<string[]>([]);

    const fetchLeadDataForRepo = async (repoId : string) => {
        return await getRepoLeads(repoId);
    };

    const handleReposSelected = useCallback(async (selected: string[]) => {
        for (const dbRepoId of selected) {
            if (!leadsCache[dbRepoId]) {
                // If data for this repoId is not cached, fetch it and update the cache
                fetchLeadDataForRepo(dbRepoId).then((fetchedLeads: Lead[]) => {
                    setLeadsCache((prev) => ({...prev, [dbRepoId]: fetchedLeads}));
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
                        <MultiSelectItem key={index} value={repo.id}>{repo.name}</MultiSelectItem>
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

            { selectedRepos.map((id, cacheIndex) => {
                const repo = repos.find(repo => repo.id === id);
                return (<div key={cacheIndex}>
                    { leadsCache[id]?.map((lead, index) => (
                        <Card key={index} className="flex flex-col my-2">
                            <Badge>{repo?.name}</Badge>
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
                            <Text>Maintainers: {JSON.parse(lead.maintainers).join(', ')}</Text>
                        </Card>
                    ))}
                </div>)
            })}
        </>
    )
}