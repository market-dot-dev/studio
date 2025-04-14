"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Lead, Repo } from "@prisma/client";
import { Search, Trash2, XCircle } from "lucide-react";
import Link from "next/link";

import { useCallback, useEffect, useState } from "react";

import {
  addLeadToShortlist,
  getDependentOwners,
  getFacets,
  getShortlistedLeadsKeysList,
  lookup
} from "@/app/services/LeadsService";
import LoadingSpinner from "../form/loading-spinner";

import { gitHubRepoOrgAndName } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FiltersPanel, { FiltersState, emptyFilters, hashFiltersState } from "./filters-panel";
import LeadItem from "./lead-item";

const errorMessages = {
  NO_DEPENDENT_OWNERS: "Selected repository has no dependent owners.",
  FAILED_GET_OWNERS_COUNT: "Failed to fetch updated dependent owners count.",
  FAILED_GET_OWNERS: "Failed to get dependent owners."
};

type LeadKey = {
  host: string;
  uuid: string;
};

const MAX_HISTORY_SIZE = 6;
let canSearchOnInputUrlChangeEffect = false;

export default function LeadsSearch({ repos }: { repos: Repo[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isUrlInputFocused, setIsUrlInputFocused] = useState<boolean>(false);
  const [repoUrl, setRepoUrl] = useState<string>(searchParams.get("repoUrl") || "");
  const [inputRepoUrl, setInputRepoUrl] = useState<string>(searchParams.get("repoUrl") || "");
  const [page, setPage] = useState<number>(parseInt(searchParams.get("page") || "1"));
  const [perPage, setPerPage] = useState<number>(parseInt(searchParams.get("perPage") || "20"));
  const [facets, setFacets] = useState<any>();
  const [urlsHistory, setUrlsHistory] = useState<string[]>([]);
  // const [showOnlyOrgs, setShowOnlyOrgs] = useState<boolean>(searchParams.get('showOnlyOrgs') === 'true' || false);

  const [radarId, setRadarId] = useState<number | null>(null);
  const [shortListedLeads, setShortListedLeads] = useState<LeadKey[]>([]);
  const [radarResults, setRadarResults] = useState<any[]>([]);

  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [totalCount, setTotalCount] = useState<number>(1);

  // lookup count is used to determine if the lookup count has changed, in order to invalidate the cache
  const [lookupCount, setLookupCount] = useState<number>(0);

  const [filters, setFilters] = useState<FiltersState>(
    (() => {
      const initialFilters: FiltersState = {} as FiltersState;
      Object.keys(emptyFilters).forEach((key: string) => {
        initialFilters[key as keyof FiltersState] = searchParams.get(key) || "";
      });
      return initialFilters;
    })()
  );

  const [searchError, setSearchError] = useState<string>("");

  const createQueryString = useCallback(
    (params: any) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value.toString());
        } else {
          newParams.delete(key);
        }
      });
      return newParams.toString();
    },
    [searchParams]
  );

  const updateSearchParameters = useCallback(() => {
    const params = {
      repoUrl: repoUrl,
      page: page.toString(),
      perPage: perPage.toString()
    } as any;

    Object.entries(filters).forEach(([key, value]) => {
      params[key as keyof FiltersState] = value;
    });

    const queryString = createQueryString(params);

    const newUrl = `${pathname}?${queryString}`;

    router.replace(newUrl, { scroll: false });
  }, [repoUrl, page, perPage, createQueryString, pathname, router, filters]);

  const validateAndModifyUrl = useCallback(
    (url: string) => {
      let updatedUrl = url;
      // If the URL starts with "http://", replace it with "https://"
      if (updatedUrl.startsWith("http://")) {
        updatedUrl = updatedUrl.replace("http://", "https://");
      }
      // If the URL does not start with any protocol, prepend "https://"
      else if (!updatedUrl.startsWith("https://")) {
        updatedUrl = "https://" + updatedUrl;
      }

      if (!updatedUrl.match(/^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)$/)) {
        setSearchError("Please enter a valid GitHub repository URL.");
        return null;
      }
      if (updatedUrl !== url) {
        setInputRepoUrl(updatedUrl);
      }
      return updatedUrl;
    },
    [setInputRepoUrl]
  );

  const handleUrlSearch = useCallback(() => {
    const validUrl = validateAndModifyUrl(inputRepoUrl);
    setPage(1);
    if (validUrl) {
      setRepoUrl(validUrl);
      // save it to the history
      saveSearchURL(validUrl);
      setIsUrlInputFocused(false);
    }
  }, [inputRepoUrl, setRepoUrl]);

  // save search url to the history
  const saveSearchURL = useCallback((url: string) => {
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory") ?? "[]") || [];

    // Remove the URL if it already exists
    searchHistory = searchHistory.filter((historyUrl: string) => historyUrl !== url);

    // Add the URL to the front
    searchHistory.unshift(url);

    // Limit the history size
    if (searchHistory.length > MAX_HISTORY_SIZE) {
      searchHistory = searchHistory.slice(0, MAX_HISTORY_SIZE);
    }

    // Save the updated history to localStorage
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    setUrlsHistory(searchHistory);
  }, []);

  const deleteSearchURL = useCallback((url: string) => {
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory") ?? "[]") || [];

    // Remove the URL from the history
    searchHistory = searchHistory.filter((historyUrl: string) => historyUrl !== url);

    // Save the updated history to localStorage
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    setUrlsHistory(searchHistory);
  }, []);

  const handleRepoSelected = useCallback(
    (selectedIndex: number) => {
      setRadarId(null);
      setPage(1);
      setInputRepoUrl(repos[selectedIndex]?.url || "");
      setRepoUrl(repos[selectedIndex]?.url || "");
      // save it to the history
      if (repos[selectedIndex]?.url) {
        saveSearchURL(repos[selectedIndex]?.url!);
      }
    },
    [setInputRepoUrl, setRepoUrl]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
    },
    [repoUrl]
  );

  const clearLeadsCache = useCallback(() => {
    Object.keys(sessionStorage).forEach((key) => {
      // Check if the key belongs to leads cache
      if (key.startsWith("leads_")) {
        sessionStorage.removeItem(key);
      }
    });
  }, []);

  const lookupRepo = useCallback(
    (initial?: boolean) => {
      if (repoUrl) {
        lookup(repoUrl)
          .then((res: any) => {
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

              // this will trigger the useeffect hook to fetch the dependent owners
              setRadarId(res.data.id);
            } else {
              // if the count has changed
              if (lookupCount !== newLookupCount) {
                clearLeadsCache();
              }
            }
          })
          .catch((error) => {
            console.log(errorMessages.FAILED_GET_OWNERS_COUNT, error);
            setIsSearching(false);
          });
      }
    },
    [repoUrl, lookup, setSearchError, setIsSearching]
  );

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
        console.error("Failed to parse cached data:", error);
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
          value={`${perPage}`}
          onValueChange={(e: string) => {
            setPerPage(parseInt(e));
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Results per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
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
    setSearchError("");

    lookupRepo(true);

    getShortlistedLeadsKeysList().then((leads: LeadKey[]) => {
      setShortListedLeads(leads);
    });
  }, [repoUrl]);

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

    // if page is higher than the total number of pages, but only if the total count has already been set
    const lastPage = totalCount && Math.ceil(totalCount / perPage);
    if (page > lastPage) {
      // set page to the last page
      setPage(lastPage);
      return;
    }

    setSearchError("");
    setIsSearching(true);
    // lookupRepo();

    getDependentOwnersWithCache()
      .then((fetchedLeads: any[]) => {
        setRadarResults(fetchedLeads);
      })
      .finally(() => {
        setIsSearching(false);
      });
  }, [page, perPage, radarId, filters]);

  useEffect(() => {
    if (!radarId) {
      return;
    }

    getFacets(radarId, filters)
      .then((res: any) => {
        if (res.error) {
          console.error("Failed to get facets:", res.error);
          return;
        }

        // Make sure res.data is an object before setting it as facets
        if (res.data && typeof res.data === "object") {
          setFacets(res.data);
        } else {
          console.error("Unexpected facets data format:", res.data);
          setFacets({}); // Set to empty object instead of null
        }
      })
      .catch((error) => {
        console.error("Error fetching facets:", error);
        setFacets({}); // Set to empty object on error
      });
  }, [radarId, filters]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("searchHistory") ?? "[]") || [];
    setUrlsHistory(storedHistory);
  }, []);

  useEffect(() => {
    if (canSearchOnInputUrlChangeEffect) {
      handleUrlSearch();
      canSearchOnInputUrlChangeEffect = false;
    }
  }, [inputRepoUrl]);

  const filterBadges = Object.keys(filters || {})
    .map((key: string) => {
      if (filters && filters[key as keyof FiltersState]) {
        return (
          <Badge key={key} variant="secondary" className="mb-1 mr-1 pr-1">
            <div className="flex flex-nowrap gap-1">
              <p className="text-sm text-stone-500">
                {key}: {filters[key as keyof FiltersState]}
              </p>
              <div
                className="cursor-pointer"
                onClick={() => {
                  setFilters((prev: FiltersState) => {
                    const newFilters = { ...prev };
                    newFilters[key as keyof FiltersState] = "";
                    return newFilters;
                  });
                }}
              >
                <XCircle className="size-5 shrink-0" />
              </div>
            </div>
          </Badge>
        );
      }
      return null;
    })
    .filter(Boolean);

  return (
    <>
      <div className="mb-4">
        <div className="flex gap-3">
          <Input
            icon={<Search />}
            value={inputRepoUrl}
            placeholder="Enter a Repo URL..."
            onFocus={() => {
              setIsUrlInputFocused(true);
            }}
            onClick={() => {
              setIsUrlInputFocused(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                setIsUrlInputFocused(false);
              }, 100);
            }}
            onInput={(e: any) => {
              setSearchError("");

              setInputRepoUrl(e.target.value);
            }}
            onKeyDown={(e: any) => {
              if (e.key === "Enter") {
                handleUrlSearch();
              }
            }}
          />
          <div
            className={
              "relative w-full " +
              (!isUrlInputFocused || !Array.isArray(urlsHistory) || !urlsHistory?.length
                ? "hidden"
                : "")
            }
          >
            <div className="absolute left-0 top-0 z-50 flex w-full flex-col rounded-b-md border border-t-0 bg-white py-2 text-sm shadow-lg">
              {Array.isArray(urlsHistory) &&
                urlsHistory.map((url: string, index: number) => {
                  return (
                    <div
                      key={index}
                      className="group flex cursor-pointer items-center justify-between px-4 hover:bg-gray-200"
                      onClick={() => {
                        canSearchOnInputUrlChangeEffect = true;

                        setInputRepoUrl(url);
                      }}
                    >
                      <div className="w-full py-2">{url}</div>
                      <Trash2
                        className="ml-2 hidden size-4 text-red-600 group-hover:block"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSearchURL(url);
                        }}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
          <Button loading={isSearching} onClick={handleUrlSearch}>
            Search
          </Button>
        </div>

        {Array.isArray(repos) && repos.length ? (
          <div className="mt-2 flex-col gap-2 md:flex-row">
            <p className="text-sm text-stone-500">
              Search for your connected repos: (
              <Link href="/settings/repos" className="underline">
                Connect More
              </Link>
              )
            </p>
            <div className="mt-2 flex w-full flex-wrap gap-2">
              {repos.map((repo, index) => {
                const repoOrgName = gitHubRepoOrgAndName(repo.url);
                return (
                  <Button
                    key={index}
                    size="sm"
                    variant={radarId && repo.radarId === radarId ? "default" : "outline"}
                    onClick={() => handleRepoSelected(index)}
                  >
                    {repoOrgName || repo.name}
                  </Button>
                );
              })}
            </div>
          </div>
        ) : (
          <Card className="my-4 w-full border border-gray-400 bg-gray-100 px-4 py-3 text-gray-700">
            <div className="mx-2 w-full">
              <p className="font-semibold">No Connected Repositories</p>
              <p>
                We recommend you connect some repositories in your{" "}
                <a href="/settings/repos" className="underline">
                  Repo Settings
                </a>
                .
              </p>
            </div>
          </Card>
        )}
      </div>

      <strong>Search Results{repoOrgName ? " for " + repoOrgName : ""}:</strong>
      {searchError ? <p className="text-sm text-red-500">{searchError}</p> : null}
      {radarResults.length ? (
        <div className="sticky -top-1 z-10 -mx-1 flex flex-col items-stretch gap-4 rounded-md border bg-white p-4 shadow-sm">
          <div className="flex w-full items-start">
            <div className="flex w-1/2 flex-col items-start justify-between gap-4 lg:w-2/3 lg:flex-row lg:items-center">
              <Pagination
                page={page}
                perPage={perPage}
                totalCount={totalCount}
                facets={facets}
                onPageChange={handlePageChange}
                isLoading={isSearching}
              />
            </div>

            <div className="flex w-1/2 items-center justify-end gap-3 lg:w-1/3">
              {resultsPerPage}
            </div>
          </div>
          {filterBadges.length ? <div>{filterBadges}</div> : null}
        </div>
      ) : null}
      <div className="grid min-h-screen w-full grid-cols-4">
        <div className="col-span-1">
          {facets && typeof facets === "object" ? (
            <FiltersPanel
              facets={facets}
              filters={filters}
              setFilters={setFilters}
              setItemsCount={setTotalCount}
            />
          ) : radarId ? (
            <LoadingSpinner />
          ) : null}
        </div>
        <div className="col-span-3">
          {isSearching ? (
            <div className="sticky top-[200px] z-50 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {Array.isArray(radarResults) &&
                radarResults.map((lead, index) => {
                  const isShortlisted =
                    Array.isArray(shortListedLeads) &&
                    shortListedLeads.some(
                      (leadKey) => leadKey.host === lead.host && leadKey.uuid === lead.uuid
                    );
                  return (
                    <SearchResult
                      key={index}
                      lead={lead}
                      isShortlisted={isShortlisted}
                      setShortListedLeads={setShortListedLeads}
                    />
                  );
                })}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function SearchResult({
  lead,
  isShortlisted,
  setShortListedLeads
}: {
  lead: Lead;
  isShortlisted: boolean;
  setShortListedLeads: any;
}) {
  const [isAddingToShortlist, setIsAddingToShortlist] = useState<boolean>(false);

  const addToShortlist = useCallback(() => {
    // Add to shortlist
    setIsAddingToShortlist(true);
    addLeadToShortlist(lead)
      .then((res) => {
        setShortListedLeads((prev: LeadKey[]) => [...prev, { host: lead.host, uuid: lead.uuid }]);
      })
      .catch((err: any) => {
        console.error("Failed to add to shortlist:", err);
      })
      .finally(() => {
        setIsAddingToShortlist(false);
      });
  }, [lead]);

  return (
    <Card className="relative z-0 my-2 flex flex-col">
      <LeadItem lead={lead} />
      <div className="absolute right-10 flex flex-col gap-4">
        {isShortlisted && <Badge variant="secondary">Shortlisted</Badge>}
        <Button
          variant="outline"
          loading={isAddingToShortlist}
          loadingText="Adding to Shortlist"
          disabled={isShortlisted || isAddingToShortlist}
          onClick={addToShortlist}
        >
          Add to Shortlist
        </Button>
      </div>
    </Card>
  );
}

function Pagination({
  page,
  perPage,
  totalCount,
  onPageChange,
  isLoading,
  facets
}: {
  page: number;
  perPage: number;
  totalCount: number;
  onPageChange: any;
  isLoading: boolean;
  facets: any;
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage)); // Ensure at least 1 page
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
  }, [page]);

  return (
    <>
      <div className="flex items-center justify-start gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => changePage(page - 1)}
          disabled={page === 1 || isLoading}
        >
          Prev
        </Button>
        <span className="text-sm">
          Page {page} of {facets && typeof facets === "object" ? totalPages : "-"}
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => changePage(page + 1)}
          disabled={page === totalPages || isLoading || !facets}
        >
          Next
        </Button>
      </div>
      <div className="flex grow items-center justify-end gap-2 lg:justify-center">
        <input
          type="number"
          // enableStepper={false}
          min={1}
          max={totalPages}
          value={inputPage}
          onChange={(e) => {
            setInputPage(e.target.valueAsNumber);
          }}
          onKeyDown={(e: any) => {
            if (e.key === "Enter") {
              handleGoClick();
            }
          }}
          className="w-20 rounded-md border border-gray-300 text-xs"
          placeholder="Go to page..."
        />

        <Button size="sm" disabled={isLoading} onClick={handleGoClick}>
          Go to Page
        </Button>
      </div>
    </>
  );
}
