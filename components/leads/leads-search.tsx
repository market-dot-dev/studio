'use client'
import { Lead, Repo } from "@prisma/client";
import { Bold, Card, Badge, SearchSelect, SearchSelectItem, Button, Text, NumberInput, Switch, SelectItem, Select, TextInput } from "@tremor/react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { getDependentOwners, addLeadToShortlist, getShortlistedLeadsKeysList, lookup, getFacets } from "@/app/services/LeadsService";
import LoadingSpinner from "../form/loading-spinner";

import LeadItem from "./lead-item";
import { gitHubRepoOrgAndName } from "@/lib/utils";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import FiltersPanel, { FiltersState, emptyFilters, hashFiltersState } from "./filters-panel";

const errorMessages = {
    NO_DEPENDENT_OWNERS: 'Selected repository has no dependent owners.',
    FAILED_GET_OWNERS_COUNT: 'Failed to fetch updated dependent owners count.',
    FAILED_GET_OWNERS: 'Failed to get dependent owners.',
    HAS_NO_OWNERS: 'Selected repository has no dependent owners.'
}

type LeadKey = {
    host: string;
    uuid: string;
}

export default function LeadsSearch({ repos }: { repos: Repo[] }) {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [repoUrl, setRepoUrl] = useState<string>(searchParams.get('repoUrl') || '');
    const [inputRepoUrl, setInputRepoUrl] = useState<string>(searchParams.get('repoUrl') || '');
    const [page, setPage] = useState<number>(parseInt(searchParams.get('page') || '1'));
    const [perPage, setPerPage] = useState<number>(parseInt(searchParams.get('perPage') || '20'));
    const [facets, setFacets] = useState<any>();
    // const [showOnlyOrgs, setShowOnlyOrgs] = useState<boolean>(searchParams.get('showOnlyOrgs') === 'true' || false);

    const [radarId, setRadarId] = useState<number | null>(null);
    const [shortListedLeads, setShortListedLeads] = useState<LeadKey[]>([]);
    const [radarResults, setRadarResults] = useState<any[]>([]);

    const [isSearching, setIsSearching] = useState<boolean>(false);
    
    const [totalCount, setTotalCount] = useState<number>(0);
    const [orgsCount, setOrgsCount] = useState<number>(0);

    const [filters, setFilters] = useState<FiltersState>((() => {
        let initialFilters: FiltersState = {} as FiltersState;
        Object.keys(emptyFilters).forEach((key: string) => {
            initialFilters[key as keyof FiltersState] = searchParams.get(key) || '';
        });
        return initialFilters;
    })());
    

    const [searchError, setSearchError] = useState<string>('');

    const createQueryString = useCallback((params: any) => {
        const newParams = new URLSearchParams(searchParams.toString());
        Object.entries(params).forEach(([key, value]) => {
            
            if (value) {
                newParams.set(key, value.toString());
            } else {
                newParams.delete(key);
            }
        });
        return newParams.toString();
    }, [searchParams]);

    const updateSearchParameters = useCallback(() => {
        const params = {
            repoUrl: repoUrl,
            page: page.toString(),
            perPage: perPage.toString(),
            // showOnlyOrgs: showOnlyOrgs.toString()
        } as any;

        Object.entries(filters).forEach(([key, value]) => {
            params[key as keyof FiltersState] = value;
        });

        const queryString = createQueryString(params);
        
        const newUrl = `${pathname}?${queryString}`;
        
        router.replace(newUrl, { scroll : false});
    }, [repoUrl, page, perPage, createQueryString, pathname, router, filters]);

    const validateAndModifyUrl = useCallback((url: string) => {
        // If the URL starts with "http://", replace it with "https://"
        if (url.startsWith('http://')) {
            url = url.replace('http://', 'https://');
        }
        // If the URL does not start with any protocol, prepend "https://"
        else if (!url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        if (!url.match(/^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)$/)) {
            setSearchError('Please enter a valid GitHub repository URL.');
            return null;
        }

        setInputRepoUrl(url);
        return url;
    }, [setInputRepoUrl]);

    const handleUrlSearch = useCallback(() => {
        const validUrl = validateAndModifyUrl(inputRepoUrl);
        setPage(1);
        if (validUrl) {
            console.log('Searching for:', validUrl);
            setRepoUrl(validUrl);
        }
    }, [inputRepoUrl, setRepoUrl]);

    const handleRepoSelected = useCallback((selectedIndex: number) => {
        setRadarId(null);
        setPage(1);
        setInputRepoUrl(repos[selectedIndex]?.url || '');
        setRepoUrl(repos[selectedIndex]?.url || '');
    }, [setInputRepoUrl, setRepoUrl]);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
    }, [repoUrl]);

    const clearLeadsCache = useCallback(() => {
        Object.keys(sessionStorage).forEach(key => {
            // Check if the key belongs to leads cache
            if (key.startsWith('leads_')) {
                sessionStorage.removeItem(key);
            }
        });
    }, [])

    const lookupRepo = useCallback((initial?: boolean) => {
        if (repoUrl) {
            lookup(repoUrl).then((res: any) => {
                
                if (res.error) {
                    if (initial) {
                        setSearchError(res.error);
                        setIsSearching(false);
                    } else {
                        console.log(errorMessages.FAILED_GET_OWNERS_COUNT, res.error);
                    }

                    return;
                }

                const newTotalCount = res.data.dependent_owners_count ?? 0;

                setTotalCount(newTotalCount);

                if (initial) {
                    if (!newTotalCount) {
                        setSearchError(errorMessages.NO_DEPENDENT_OWNERS);
                        setIsSearching(false);
                    }

                    // this will trigger the useeffect hook to fetch the dependent owners
                    setRadarId(res.data.id);

                } else {
                    // if the count has changed
                    if (totalCount !== newTotalCount) {
                        clearLeadsCache();
                    }

                }
                setOrgsCount(res.data.dependent_organizations_count ?? 0);

            }).catch(error => {
                console.log(errorMessages.FAILED_GET_OWNERS_COUNT, error)
                setIsSearching(false);
            }); 
        }
    }, [repoUrl, setTotalCount, setOrgsCount, lookup, totalCount, setSearchError, setIsSearching])

    const getDependentOwnersWithCache = useCallback(async () => {

        const cacheKey = `leads_${radarId!}_${page}_${perPage}_` + hashFiltersState(filters);
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
            const res = await getDependentOwners(radarId!, page, perPage, filters);

            if (res.error) {
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

            setSearchError(errorMessages.FAILED_GET_OWNERS);
            return [];
        }
    }, [radarId, page, perPage, setSearchError, filters]);

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

    const repoOrgName = gitHubRepoOrgAndName(repoUrl);

    useEffect(() => {

        if (!repoUrl) {
            return;
        }

        setIsSearching(true);
        setRadarResults([]);
        setSearchError('');
        
        lookupRepo(true);

        getShortlistedLeadsKeysList().then((leads: LeadKey[]) => {
            setShortListedLeads(leads);
        });

    }, [repoUrl])

    

    useEffect(() => {
        
        if (!radarId) {
            return;
        }

        updateSearchParameters();

        if (!totalCount) {
            setSearchError(errorMessages.HAS_NO_OWNERS);
            setRadarResults([]);
            setIsSearching(false);
            return;
        }

        // if page is higher than the total number of pages
        const lastPage = Math.ceil( totalCount / perPage);
        if (page > lastPage) {
            // set page to the last page
            setPage(lastPage);
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

    }, [page, perPage, radarId, filters]);

    useEffect(() => {

        if(!radarId) {
            return;
        }

        getFacets(radarId, filters.kind).then((res: any) => {
            if (res.error) {
                console.error('Failed to get facets:', res.error);
                return;
            }
            setFacets(res.data);
        });

    }, [radarId, filters.kind])

    return (
        <>
            <div className="mb-4">

                <div className="relative">
                    <TextInput icon={Search} value={inputRepoUrl} placeholder="Enter a Repo URL..." onInput={ (e: any) => {
                        setSearchError('');
                        setInputRepoUrl(e.target.value);
                    }}
                    onKeyDown={(e: any) => {
                        if (e.key === 'Enter') {
                            handleUrlSearch();
                        }
                    }}

                    />
                    <div className="absolute right-0 top-0 h-full inline-block">
                        <Button className="rounded-l-none" onClick={handleUrlSearch} disabled={isSearching} loading={isSearching}>Search</Button>
                    </div>
                </div>
                

                {repos.length ?
                    <div className="flex-col gap-2 mt-2 md:flex-row">
                        <Text>Search for your connected repos: (<Link href="/settings/repos" className="underline">Connect More</Link>)</Text>
                        <div className="flex gap-2 mt-2 flex-wrap w-full">
                            {repos.map((repo, index) => {
                                const repoOrgName = gitHubRepoOrgAndName(repo.url);
                                return (
                                    <Button size="xs" key={index} className={'rounded-xl py-0 px-2' + (radarId && repo.radarId === radarId ? ' bg-black' : ' bg-gray-600')} onClick={() => handleRepoSelected(index)}>{repoOrgName || repo.name}</Button>
                                )
                            })}
                        </div>
                    </div>
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

            <Bold>Search Results{ repoOrgName ? ' for ' + repoOrgName : ''}:</Bold>
            {searchError ? <Text className="text-red-500">{searchError}</Text> : null}
            {radarResults.length ?
                <div className="flex flex-col gap-4 items-stretch sticky -top-1 z-10 bg-white p-4 shadow-sm border rounded-md -mr-1 -ml-1">
                    <div className="flex justify-between items-center w-full">

                        <Pagination
                            page={page}
                            perPage={perPage}
                            totalCount={totalCount}
                            onPageChange={handlePageChange}
                            isLoading={isSearching}
                        />


                        <div className="hidden items-center justify-end gap-3 w-1/3 lg:flex">
                            {resultsPerPage}
                        </div>

                    </div>
                    <div className="flex justify-between items-center w-full border border-t-1 border-b-0 border-l-0 border-r-0 pt-4">

                        <div className="flex items-center justify-end gap-3 w-1/2 lg:hidden">
                            {resultsPerPage}
                        </div>
                    </div>
                </div>
                : null
            }
            <div className="grid grid-cols-4 w-full min-h-[100vh]">
                <div className="col-span-1">
                    { facets ?
                        <FiltersPanel facets={facets} filters={filters} setFilters={setFilters} />
                        : null
                    }
                </div>
                <div className="col-span-3">
                    {isSearching ?
                        <div className="flex justify-center items-center sticky top-[200px] z-50">
                            <LoadingSpinner />
                        </div>
                        :
                        <>
                            {radarResults?.map((lead, index) => {
                                const isShortlisted = shortListedLeads.some(leadKey => leadKey.host === lead.host && leadKey.uuid === lead.uuid);
                                return <SearchResult key={index} lead={lead} isShortlisted={isShortlisted} setShortListedLeads={setShortListedLeads} />
                            })}

                        </>

                    }
                </div>
            </div>



        </>
    )
}



function SearchResult({ lead, isShortlisted, setShortListedLeads }: { lead: Lead, isShortlisted: boolean, setShortListedLeads: any }) {
    const [isAddingToShortlist, setIsAddingToShortlist] = useState<boolean>(false);

    const addToShortlist = useCallback(() => {
        // Add to shortlist
        setIsAddingToShortlist(true);
        addLeadToShortlist(lead).then(res => {
            setShortListedLeads((prev: LeadKey[]) => [...prev, { host: lead.host, uuid: lead.uuid }]);
        })
            .catch((err: any) => {
                console.error('Failed to add to shortlist:', err);
            })
            .finally(() => {
                setIsAddingToShortlist(false);
            });
    }, [lead])

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
                    onKeyDown={(e: any) => {
                        if (e.key === 'Enter') {
                            handleGoClick();
                        }
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
