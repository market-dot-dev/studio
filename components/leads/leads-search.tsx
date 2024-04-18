'use client'
import {  Lead, Repo } from "@prisma/client";
import { Bold, Card, Badge, SearchSelect, SearchSelectItem, Button, Text, NumberInput, Switch, SelectItem, Select } from "@tremor/react";

import { useCallback, useEffect, useState } from "react";

import { getDependentOwners, addLeadToShortlist, getShortlistedLeadsKeysList, lookup } from "@/app/services/LeadsService";
import LoadingSpinner from "../form/loading-spinner";

import LeadItem from "./lead-item";


type LeadKey = {
    host: string;
    uuid: string;
}

export default function LeadsSearch({ repos }: { repos: Repo[] }) {
    
    const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
    const [shortListedLeads, setShortListedLeads] = useState<LeadKey[]>([]);
    const [radarResults, setRadarResults] = useState<any[]>([]);
    
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(20);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [orgsCount, setOrgsCount] = useState<number>(0);

    const [showOnlyOrgs, setShowOnlyOrgs] = useState<boolean>(true);

    const [searchError, setSearchError] = useState<string>('');

    const handleRepoSelected = useCallback((selectedIndex: string) => {
        setSelectedRepo(repos[parseInt(selectedIndex)]);
    }, [setSelectedRepo]);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
    }, [selectedRepo]);

    const clearLeadsCache = useCallback(() => {
        Object.keys(sessionStorage).forEach(key => {
            // Check if the key belongs to leads cache
            if (key.startsWith('leads_')) {
                sessionStorage.removeItem(key);
            }
        });
    }, [])

    const lookupRepo = useCallback((initial?: boolean) => {
        if( selectedRepo?.url ) {
            try {
                lookup(selectedRepo.url).then((res: any) => {
                    
                    if( res.error ) {
                        if( initial ) {
                            setSearchError(res.error);
                            setIsSearching(false);
                        } else {
                            console.log('Failed to fetch updated dependent owners count');
                        }

                        return;
                    }

                    setTotalCount( prev => {
                        if( !initial ) {
                            // if the count has changed
                            if( prev !== res.data.dependent_owners_count ) {
                                clearLeadsCache();
                            }
                        }
                        return res.data.dependent_owners_count ?? 0
                    });
                    
                    setOrgsCount(res.data.dependent_organizations_count ?? 0);
                });
            } catch (error) {
                console.log('Failed to fetch dependent owners count:', error)
                setIsSearching(false);
            } 
        }
    }, [ selectedRepo?.url, setTotalCount, setOrgsCount, lookup ])

    const getDependentOwnersWithCache = useCallback(async () => {

        const cacheKey = `leads_${selectedRepo!.radarId!}_${page}_${perPage}_${showOnlyOrgs}`;
        const cachedData = sessionStorage.getItem(cacheKey);

        if (cachedData) {
            try {
                const { data, timestamp } = JSON.parse(cachedData);
                const now = new Date().getTime();

                // Check if the cached data is older than 5 minutes
                if (now - timestamp < 300000) {
                    return data;
                }
            } catch (error) {
                console.error('Failed to parse cached data:', error);
            }
        }
        try {
            const res = await getDependentOwners(selectedRepo!.radarId!, page, perPage, showOnlyOrgs);
            
            if( res.error ) {
                setSearchError(res.error);
                return [];
            }

            const itemToCache = {
                data: res.data,
                timestamp: new Date().getTime() // Save current time as timestamp
            };
            sessionStorage.setItem(cacheKey, JSON.stringify(itemToCache));
            return res.data;

        } catch (error) {
            
            setSearchError('Failed to fetch dependent owners.');
            return [];
        }
    }, [selectedRepo?.radarId, page, perPage, showOnlyOrgs, setSearchError]);

    useEffect(() => {
        
        if( !selectedRepo?.url ) {
            return;
        }

        setIsSearching(true);
        lookupRepo(true);

        getShortlistedLeadsKeysList(selectedRepo.id).then((leads: LeadKey[]) => {
            setShortListedLeads(leads);
        });
    }, [selectedRepo])

    useEffect(() => {
        
        if( !selectedRepo?.radarId ) {
            setIsSearching(false);
            return;
        }
            
        if(!totalCount) {
            setSearchError("Selected Repsoitory has no dependent owners.");
            setIsSearching(false);
            return;
        }
        
        setSearchError('');
        setIsSearching(true);
        lookupRepo();
        
        getDependentOwnersWithCache().then((fetchedLeads: any[]) => {
            setRadarResults(fetchedLeads);
        })
        .finally(() => {
            setIsSearching(false);
        });

    }, [page, perPage, showOnlyOrgs, totalCount]);

    const resultsPerPage = (
        <>
        <div className="text-sm">Results per Page</div>
        <div>
            <Select 
                disabled={isSearching}
                className="w-24" value={`${perPage}`} onValueChange={(e: string) => {
                setPerPage(parseInt(e));
            }}>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
            </Select>
        </div>
        </>
    )

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
            { searchError ? <Text className="text-red-500">{searchError}</Text> : null }
            { radarResults.length ?
            <div className="flex flex-col gap-4 items-stretch">
                <div className="flex justify-between items-center bg-white p-4 sticky -top-1 z-10 shadow-sm border rounded-md -mr-1 -ml-1">

                    <Pagination
                        page={page}
                        perPage={perPage}
                        totalCount={showOnlyOrgs ? orgsCount : totalCount}
                        onPageChange={handlePageChange}
                        isLoading={isSearching}
                    />
                    
                    
                    <div className="hidden items-center justify-end gap-3 w-1/3 lg:flex">
                        {resultsPerPage}
                    </div>
                    
                </div>
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center justify-center gap-3">
                        <Switch
                            id="switch"
                            name="switch"
                            checked={showOnlyOrgs}
                            onChange={setShowOnlyOrgs}
                            disabled={isSearching}
                        />
                        <label htmlFor="switch" className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                            Show only organizations
                        </label>
                    </div>

                    <div className="flex items-center justify-end gap-3 w-1/2 lg:hidden">
                        {resultsPerPage}
                    </div>
                </div>
            </div>
                :null
                }
                
                    { isSearching ? 
                    <div className="flex justify-center items-center">
                        <LoadingSpinner />
                    </div> 
                    : 
                    <>
                        { radarResults?.map((lead, index) => {
                            const isShortlisted = shortListedLeads.some(leadKey => leadKey.host === lead.host && leadKey.uuid === lead.uuid);
                            return <SearchResult key={index} lead={lead} isShortlisted={isShortlisted} setShortListedLeads={setShortListedLeads} selectedRepo={selectedRepo} />   
                        })}
                        
                    </>
                }

            
                
        </>
    )
}



function SearchResult( { selectedRepo, lead, isShortlisted, setShortListedLeads } : { selectedRepo: Repo | null, lead: Lead, isShortlisted: boolean, setShortListedLeads: any}) {
    const [isAddingToShortlist, setIsAddingToShortlist] = useState<boolean>(false);

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
    return (
        <Card className="flex flex-col my-2 z-0 relative">
            <LeadItem lead={lead} />
            <div className="flex flex-col absolute top-10 right-10 gap-4">
                {isShortlisted && <Badge>Shortlisted</Badge>}
                <Button
                    loading={isAddingToShortlist}
                    disabled={isShortlisted || isAddingToShortlist}
                    onClick={() => addToShortlist(lead)} 
                >Add to Shortlist</Button>
            </div>
        </Card>
    )
}


function Pagination({ page, perPage, totalCount, onPageChange, isLoading }: { page: number, perPage: number, totalCount: number, onPageChange: any, isLoading: boolean }) {
    const totalPages = Math.ceil(totalCount / perPage);
    const [inputPage, setInputPage] = useState<number>(page);

    const changePage = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            onPageChange(newPage);
        }
    };

    const handleGoClick = useCallback(() => {
        if (!isNaN(inputPage) && inputPage !== page) {
            changePage(inputPage); 
        }
    }, [page, inputPage]);

    useEffect(() => {
        setInputPage(page);
    }, [page])

    return (
        
        <div className="flex justify-start items-center gap-8 w-full lg:w-2/3">
            <div className="flex justify-center items-center gap-2">
                <Button
                    size="xs"
                    onClick={() => changePage(page - 1)}
                    disabled={page === 1 || isLoading}
                    className={`${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    Prev
                </Button>
                <span className="text-sm font-medium">Page {page} of {totalPages}</span>
                
                <Button
                    size="xs"
                    onClick={() => changePage(page + 1)}
                    disabled={page === totalPages || isLoading}
                    className={`${page === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    Next
                </Button>
            </div>
            <div className="flex justify-end lg:justify-center items-center gap-2 grow">
                
                <input
                    type="number"
                    // enableStepper={false}
                    min={1}
                    max={100}
                    value={inputPage}
                    onChange={(e) => {
                        setInputPage(e.target.valueAsNumber)
                    }}
                    className="border rounded-md text-xs w-20 border-gray-300"
                    placeholder="Go to page..."
                />
                
                <Button
                    size="xs"
                    disabled={isLoading}
                    onClick={handleGoClick} >
                    Go to Page
                </Button>
            </div>
        </div>
            
        
    );
}
