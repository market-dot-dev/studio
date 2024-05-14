'use client'
import { Repo } from "@prisma/client";
import { Bold, Card, Badge, Button, Text, SelectItem, Select, TextInput } from "@tremor/react";
import Link from "next/link";
import { Search, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { getDependentOwners, getShortlistedLeadsKeysList, lookup, getFacets } from "@/app/services/LeadsService";
import LoadingSpinner from "../form/loading-spinner";


import { gitHubRepoOrgAndName } from "@/lib/utils";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import FiltersPanel, { FiltersState, emptyFilters, hashFiltersState } from "./filters-panel";
import LeadsPagination from "./leads-pagination";
import LeadsSearchResult from "./leads-search-result";

const errorMessages = {
    NO_DEPENDENT_OWNERS: 'Selected repository has no dependent owners.',
    FAILED_GET_OWNERS_COUNT: 'Failed to fetch updated dependent owners count.',
    FAILED_GET_OWNERS: 'Failed to get dependent owners.',
}

export type LeadKey = {
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
    const [radarId, setRadarId] = useState<number | null>(null);
    const [shortListedLeads, setShortListedLeads] = useState<LeadKey[]>([]);
    const [radarResults, setRadarResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [totalCount, setTotalCount] = useState<number>(1);
    const [lookupCount, setLookupCount] = useState<number>(0);
    const [filters, setFilters] = useState<FiltersState>(initializeFilters(searchParams));
    const [searchError, setSearchError] = useState<string>('');

    function initializeFilters(searchParams : URLSearchParams) {
        let initialFilters: FiltersState = {} as FiltersState;
        Object.keys(emptyFilters).forEach((key: string) => {
            initialFilters[key as keyof FiltersState] = searchParams.get(key) || '';
        });
        return initialFilters;
    }

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
            repoUrl,
            page: page.toString(),
            perPage: perPage.toString(),
            ...filters
        };

        const queryString = createQueryString(params);
        const newUrl = `${pathname}?${queryString}`;
        router.replace(newUrl, { scroll : false });
    }, [repoUrl, page, perPage, createQueryString, pathname, router, filters]);

    const validateAndModifyUrl = useCallback((url: string) => {
        if (url.startsWith('http://')) {
            url = url.replace('http://', 'https://');
        } else if (!url.startsWith('https://')) {
            url = 'https://' + url;
        }

        if (!url.match(/^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)$/)) {
            setSearchError('Please enter a valid GitHub repository URL.');
            return null;
        }

        setInputRepoUrl(url);
        return url;
    }, []);

    const handleUrlSearch = useCallback(() => {
        const validUrl = validateAndModifyUrl(inputRepoUrl);
        setPage(1);
        if (validUrl) {
            setRepoUrl(validUrl);
        }
    }, [inputRepoUrl, validateAndModifyUrl]);

    const handleRepoSelected = useCallback((selectedIndex: number) => {
        const selectedRepo = repos[selectedIndex]?.url || '';
        setRadarId(null);
        setPage(1);
        setInputRepoUrl(selectedRepo);
        setRepoUrl(selectedRepo);
    }, [repos]);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    const clearLeadsCache = useCallback(() => {
        Object.keys(sessionStorage).forEach(key => {
            if (key.startsWith('leads_')) {
                sessionStorage.removeItem(key);
            }
        });
    }, []);

    const lookupRepo = useCallback((initial = false) => {
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

                const newLookupCount = res.data.dependent_owners_count ?? 0;
                setLookupCount(newLookupCount);

                if (initial) {
                    if (!newLookupCount) {
                        setSearchError(errorMessages.NO_DEPENDENT_OWNERS);
                        setIsSearching(false);
                    }
                    setRadarId(res.data.id);
                } else if (lookupCount !== newLookupCount) {
                    clearLeadsCache();
                }
            }).catch(error => {
                console.log(errorMessages.FAILED_GET_OWNERS_COUNT, error);
                setIsSearching(false);
            });
        }
    }, [repoUrl, lookupCount, clearLeadsCache]);

    const getDependentOwnersWithCache = useCallback(async () => {
        const cacheKey = `leads_${radarId!}_${page}_${perPage}_` + hashFiltersState(filters);
        const cachedData = sessionStorage.getItem(cacheKey);

        if (cachedData) {
            try {
                const { data, timestamp } = JSON.parse(cachedData);
                const now = Date.now();

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
                timestamp: Date.now()
            };
            sessionStorage.setItem(cacheKey, JSON.stringify(itemToCache));
            return res.data;
        } catch (error) {
            setSearchError(errorMessages.FAILED_GET_OWNERS);
            return [];
        }
    }, [radarId, page, perPage, filters]);

    const resultsPerPage = (
        <>
            <div className="text-sm">Results per Page</div>
            <div>
                <Select
                    disabled={isSearching}
                    value={`${perPage}`} onValueChange={(e: string) => {
                        setPerPage(parseInt(e));
                    }}>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                </Select>
            </div>
        </>
    );

    const repoOrgName = gitHubRepoOrgAndName(repoUrl);

    useEffect(() => {
        if (!repoUrl) {
            return;
        }

        setIsSearching(true);
        setRadarResults([]);
        setFacets(null);
        setSearchError('');

        lookupRepo(true);

        getShortlistedLeadsKeysList().then((leads: LeadKey[]) => {
            setShortListedLeads(leads);
        });

    }, [repoUrl, lookupRepo]);

    useEffect(() => {
        if (!radarId) {
            return;
        }

        updateSearchParameters();

        if (!lookupCount) {
            setSearchError(errorMessages.NO_DEPENDENT_OWNERS);
            setRadarResults([]);
            setIsSearching(false);
            return;
        }

        const lastPage = totalCount && Math.ceil(totalCount / perPage);
        if (page > lastPage) {
            setPage(lastPage);
            return;
        }

        setSearchError('');
        setIsSearching(true);

        getDependentOwnersWithCache().then((fetchedLeads: any[]) => {
            setRadarResults(fetchedLeads);
        }).finally(() => {
            setIsSearching(false);
        });

    }, [page, perPage, radarId, filters, updateSearchParameters, lookupCount, totalCount, getDependentOwnersWithCache]);

    useEffect(() => {
        if (!radarId) {
            return;
        }

        getFacets(radarId, filters).then((res: any) => {
            if (res.error) {
                console.error('Failed to get facets:', res.error);
                return;
            }
            setFacets(res.data);
        });

    }, [radarId, filters]);

    const filterBadges = Object.keys(filters).map((key: string) => {
        if (filters[key as keyof FiltersState]) {
            return (
                <Badge key={key} className="pr-1 mr-1 mb-1">
                    <div className="flex flex-nowrap gap-1">
                        <Text>{key}: {filters[key as keyof FiltersState]}</Text>
                        <div className="cursor-pointer" 
                            onClick={() => setFilters(prev => ({ ...prev, [key]: '' }))}>
                            <XCircle className="h-5 w-5 flex-shrink-0" />
                        </div>
                    </div>
                </Badge>
            );
        }
        return null;
    }).filter(Boolean);

    return (
        <>
            <div className="mb-4">
                <div className="relative">
                    <TextInput icon={Search} value={inputRepoUrl} placeholder="Enter a Repo URL..." 
                        onInput={(e : any) => { setSearchError(''); setInputRepoUrl(e.target.value); }}
                        onKeyDown={(e) => { if ( e.key === 'Enter' ) handleUrlSearch(); }}
                    />
                    <div className="absolute right-0 top-0 h-full inline-block">
                        <Button className="rounded-l-none" onClick={handleUrlSearch} disabled={isSearching} loading={isSearching}>Search</Button>
                    </div>
                </div>

                {repos.length ? (
                    <div className="flex-col gap-2 mt-2 md:flex-row">
                        <Text>Search for your connected repos: (<Link href="/settings/repos" className="underline">Connect More</Link>)</Text>
                        <div className="flex gap-2 mt-2 flex-wrap w-full">
                            {repos.map((repo, index) => {
                                const repoOrgName = gitHubRepoOrgAndName(repo.url);
                                return (
                                    <Button size="xs" key={index} className={`rounded-xl py-0 px-2 ${radarId && repo.radarId === radarId ? ' bg-black' : ' bg-gray-600'}`} 
                                        onClick={() => handleRepoSelected(index)}>
                                        {repoOrgName || repo.name}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <Card className="my-4 w-full bg-gray-100 border border-gray-400 px-4 py-3 text-gray-700">
                        <div className="mx-2 w-full">
                            <p className="font-semibold">No Connected Repositories</p>
                            <p>We recommend you connect some repositories in your <a href="/settings/repos" className="underline">Repo Settings</a>.</p>
                        </div>
                    </Card>
                )}
            </div>

            <Bold>Search Results{repoOrgName ? ' for ' + repoOrgName : ''}:</Bold>
            {searchError ? <Text className="text-red-500">{searchError}</Text> : null}
            {radarResults.length ? (
                <div className="flex flex-col gap-4 items-stretch sticky -top-1 z-10 bg-white p-4 shadow-sm border rounded-md -mr-1 -ml-1">
                    <div className="flex w-full items-start">
                        <div className="flex flex-col justify-between items-start w-1/2 gap-4 lg:w-2/3 lg:flex-row lg:items-center">
                            <LeadsPagination page={page} perPage={perPage} totalCount={totalCount} onPageChange={handlePageChange} isLoading={isSearching} facets={facets} />
                        </div>
                        <div className="flex items-center justify-end gap-3 w-1/2 lg:w-1/3">
                            {resultsPerPage}
                        </div>
                    </div>
                    {filterBadges.length ? <div>{filterBadges}</div> : null}
                </div>
            ) : null}
            <div className="grid grid-cols-4 w-full min-h-[100vh]">
                <div className="col-span-1">
                    {facets ? (
                        <FiltersPanel facets={facets} filters={filters} setFilters={setFilters} setItemsCount={setTotalCount} />
                    ) : radarId ? <LoadingSpinner /> : null}
                </div>
                <div className="col-span-3">
                    {isSearching ? (
                        <div className="flex justify-center items-center sticky top-[200px] z-50">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <>
                            {radarResults.map((lead, index) => {
                                const isShortlisted = shortListedLeads.some(leadKey => leadKey.host === lead.host && leadKey.uuid === lead.uuid);
                                return <LeadsSearchResult key={index} lead={lead} isShortlisted={isShortlisted} setShortListedLeads={setShortListedLeads} />
                            })}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}