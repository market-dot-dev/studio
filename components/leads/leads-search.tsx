'use client'
import { Lead, Repo } from "@prisma/client";
import { Bold, Card, Text, Badge, SearchSelect, SearchSelectItem, Button } from "@tremor/react";

import { useCallback, useEffect, useState } from "react";

import { getDependentOwners, addLeadToShortlist, getShortlistedLeadsKeysList } from "@/app/services/LeadsService";

type LeadKey = {
    host: string;
    uuid: string;
}

export default function LeadsSearch({ repos }: { repos: Repo[] }) {
    
    const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
    const [shortListedLeads, setShortListedLeads] = useState<LeadKey[]>([]);
    const [radarResults, setRadarResults] = useState<any[]>([]);
    const [isAddingToShortlist, setIsAddingToShortlist] = useState<boolean>(false);

    const fetchLeadDataForRepo = async (repoId : number) => {
        return await getDependentOwners(repoId);
    };

    const handleRepoSelected = useCallback((selectedIndex: string) => {
        setSelectedRepo(repos[parseInt(selectedIndex)]);
    }, [setSelectedRepo, setRadarResults]);

    const addToShortlist = useCallback((lead : any) => {
        
        if( !selectedRepo ) {
            return;
        }

        // Add to shortlist
        setIsAddingToShortlist(true);
        addLeadToShortlist(lead, selectedRepo.id).then(res => {
            setShortListedLeads((prev: LeadKey[]) => [...prev, { host: lead.host, uuid: lead.uuid }]);
        })
        .catch((err: any) => {
            console.error('Failed to add to shortlist:', err);
        })
        .finally(() => {
            setIsAddingToShortlist(false);
        });
    }, [selectedRepo])

    useEffect(() => {
        if( !selectedRepo?.radarId ) {
            return;
        }
        fetchLeadDataForRepo(selectedRepo.radarId).then((fetchedLeads: any[]) => {
            setRadarResults(fetchedLeads);
        });
        getShortlistedLeadsKeysList(selectedRepo.id).then((leads: LeadKey[]) => {
            setShortListedLeads(leads);
        });
    }, [selectedRepo])

    return (
        <>
            <div className="mb-4">
                <Bold>Search for a Repo:</Bold>
                { repos.length ?
                <SearchSelect onValueChange={handleRepoSelected}>
                    {repos.map((repo, index) => (
                        <SearchSelectItem key={index} value={`${index}`}>{repo.name}</SearchSelectItem>
                    ))}
                </SearchSelect>

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
            
            { radarResults?.map((lead, index) => {
                const isShortlisted = shortListedLeads.some(leadKey => leadKey.host === lead.host && leadKey.uuid === lead.uuid);
                return (<Card key={index} className="flex flex-col my-2 relative">
                    {/* <Badge>{repo?.name}</Badge> */}
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
                    <div className="flex flex-col absolute top-10 right-10">
                        {isShortlisted && <Badge>Shortlisted</Badge>}
                        <Button
                            loading={isAddingToShortlist}
                            disabled={isShortlisted || isAddingToShortlist}
                            onClick={() => addToShortlist(lead)} 
                        >Add to Shortlist</Button>
                    </div>
                </Card>)
                })}
                
        </>
    )
}