"use client";
import { getDependentOwners, getFacets, lookup } from "@/app/services/radar-api-service";
import { type FiltersState, getShortlistedLeadsKeysList } from "@/app/services/research-service";
import { extractGitHubRepoInfo } from "@/lib/github";
import type { ResearchKey } from "@/types/research";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "../form/loading-spinner";
import FiltersPanel, { emptyFilters, hashFiltersState } from "./filters-panel";
import ResearchResults from "./research-results";
import ResultsHeader from "./results-header";
import { SearchBar } from "./search-bar";

const errorMessages = {
  NO_DEPENDENT_OWNERS: "No dependent owners found for the provided URL.",
  FAILED_GET_OWNERS_COUNT: "Failed to fetch updated dependent owners count.",
  FAILED_GET_OWNERS: "Failed to get dependent owners."
};

const MAX_HISTORY_SIZE = 6;

export default function ResearchExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL and search state
  const [repoUrl, setRepoUrl] = useState<string>(searchParams.get("repoUrl") || "");
  const [urlsHistory, setUrlsHistory] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string>("");

  // Results state
  const [researchResults, setResearchResults] = useState<any[]>([]);
  const [shortListedResearch, setShortListedResearch] = useState<ResearchKey[]>([]);
  const [radarId, setRadarId] = useState<number | null>(null);
  const [lookupCount, setLookupCount] = useState<number>(0);

  // Pagination and filtering
  const [page, setPage] = useState<number>(parseInt(searchParams.get("page") || "1"));
  const [perPage, setPerPage] = useState<number>(parseInt(searchParams.get("perPage") || "20"));
  const [totalCount, setTotalCount] = useState<number>(1);
  const [facets, setFacets] = useState<any>();
  const [filters, setFilters] = useState<FiltersState>(
    (() => {
      const initialFilters: FiltersState = {} as FiltersState;
      Object.keys(emptyFilters).forEach((key: string) => {
        initialFilters[key as keyof FiltersState] = searchParams.get(key) || "";
      });
      return initialFilters;
    })()
  );

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
      perPage: perPage.toString(),
      ...filters
    };

    const queryString = createQueryString(params);
    const newUrl = `${pathname}?${queryString}`;
    router.replace(newUrl, { scroll: false });
  }, [repoUrl, page, perPage, createQueryString, pathname, router, filters]);

  const validateAndModifyUrl = useCallback((url: string) => {
    let updatedUrl = url;
    // If the URL starts with "http://", replace it with "https://"
    if (updatedUrl.startsWith("http://")) {
      updatedUrl = updatedUrl.replace("http://", "https://");
    }
    // If the URL does not start with any protocol, prepend "https://"
    else if (!updatedUrl.startsWith("https://")) {
      updatedUrl = "https://" + updatedUrl;
    }

    if (!updatedUrl.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)$/)) {
      setSearchError("Please enter a valid GitHub repository URL.");
      return null;
    }
    return updatedUrl;
  }, []);

  const handleUrlSearch = useCallback((validUrl: string) => {
    setPage(1);
    setRepoUrl(validUrl);
    saveSearchURL(validUrl);
  }, []);

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

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const clearResearchCache = useCallback(() => {
    Object.keys(sessionStorage).forEach((key) => {
      // Check if the key belongs to research cache
      if (key.startsWith("research_")) {
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
                clearResearchCache();
              }
            }
          })
          .catch((error) => {
            console.log(errorMessages.FAILED_GET_OWNERS_COUNT, error);
            setIsSearching(false);
          });
      }
    },
    [repoUrl, lookupCount, clearResearchCache]
  );

  const getDependentOwnersWithCache = useCallback(async () => {
    const cacheKey = `research_${radarId!}_${page}_${perPage}_` + hashFiltersState(filters);
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
  }, [radarId, page, perPage, filters]);

  const handleRemoveFilter = useCallback((key: string) => {
    setFilters((prev: FiltersState) => {
      const newFilters = { ...prev };
      newFilters[key as keyof FiltersState] = "";
      return newFilters;
    });
  }, []);

  const repoOrgName = extractGitHubRepoInfo(repoUrl);

  // Load initial search history
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("searchHistory") ?? "[]") || [];
    setUrlsHistory(storedHistory);
  }, []);

  // Handle URL search
  useEffect(() => {
    if (!repoUrl) {
      return;
    }

    setIsSearching(true);
    setResearchResults([]);
    setFacets(null);
    setSearchError("");

    lookupRepo(true);

    getShortlistedLeadsKeysList().then((leads) => {
      setShortListedResearch(leads);
    });
  }, [repoUrl, lookupRepo]);

  // Handle pagination and filter changes
  useEffect(() => {
    if (!radarId) {
      return;
    }

    updateSearchParameters();

    if (!lookupCount) {
      setSearchError(errorMessages.NO_DEPENDENT_OWNERS);
      setResearchResults([]);
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

    getDependentOwnersWithCache()
      .then((fetchedResults: any[]) => {
        setResearchResults(fetchedResults);
      })
      .finally(() => {
        setIsSearching(false);
      });
  }, [
    page,
    perPage,
    radarId,
    filters,
    lookupCount,
    totalCount,
    getDependentOwnersWithCache,
    updateSearchParameters
  ]);

  // Load facets
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

  return (
    <>
      <div className="mb-4">
        <SearchBar
          initialValue={repoUrl}
          isLoading={isSearching}
          onSearch={handleUrlSearch}
          onValidate={validateAndModifyUrl}
          history={urlsHistory}
          onDeleteHistory={deleteSearchURL}
        />
      </div>

      <strong>Search Results{repoOrgName ? " for " + repoOrgName : ""}:</strong>
      {searchError ? <p className="text-sm text-red-500">{searchError}</p> : null}

      {researchResults.length > 0 && (
        <ResultsHeader
          page={page}
          perPage={perPage}
          totalCount={totalCount}
          facets={facets}
          isSearching={isSearching}
          filters={filters}
          onPageChange={handlePageChange}
          onPerPageChange={setPerPage}
          onRemoveFilter={handleRemoveFilter}
        />
      )}

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
            <ResearchResults
              results={researchResults}
              shortListedResearch={shortListedResearch}
              setShortListedResearch={setShortListedResearch}
            />
          )}
        </div>
      </div>
    </>
  );
}
