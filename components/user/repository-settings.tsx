'use client'
import { searchUserRepos, verifyAndConnectRepo, disconnectRepo } from "@/app/services/RepoService";
import { Repo } from "@prisma/client";
import { Card, Flex, Text, TextInput, Button, Grid, Col, Bold } from "@tremor/react";
import { set } from "date-fns";
import { Github, SearchIcon, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function SearchResultRepo({repo, setRepos, isConnected}: {repo: any, setRepos: any, isConnected: boolean}) {

    const [connecting, setConnecting] = useState<boolean>(false);

    const connect = useCallback(() => {
        setConnecting(true);
        verifyAndConnectRepo(repo.id)
            .then((newRepo : Partial<Repo>) => {
                setRepos((currentRepos : Partial<Repo>[]) => [...currentRepos, newRepo]);
                
            })
            .catch(error => console.error("Failed to connect repo:", error))
            .finally(() => setConnecting(false));
    }, [repo.id, setRepos]);

    const classNames = "p-4 border border-b-0" + (isConnected ? " opacity-50" : "");

    return (
        <Flex className={classNames}>
            <Flex justifyContent="start" className="grow">
                <Github size={32} />
                <Bold>{repo.name}</Bold>
            </Flex>
            <div className="text-right">
                <Button size="xs" onClick={connect} loading={connecting} disabled={isConnected || connecting}>{isConnected ? 'Connected' : 'Connect'}</Button>
            </div>
        </Flex>
    )
}

function RepoItem({repo, setRepos}: {repo: Partial<Repo>, setRepos: any }) {
    const [disconnecting, setDisconnecting] = useState<boolean>(false);

    const disconnect = useCallback(() => {
        if(!repo.repoId) return;

        setDisconnecting(true);
        disconnectRepo(repo.repoId)
            .then(() => {
                setRepos((currentRepos: Partial<Repo>[]) => currentRepos.filter(item => item.repoId !== repo.repoId));
            })
            .catch(error => console.error("Failed to disconnect repo:", error))
            .finally(() => setDisconnecting(false));
    }, [repo.repoId, setRepos]);

    return (
        <Card className="p-2 mb-2">
            <div className="flex flex-row justify-items-center text-center">
                <Github size={32} />
                <Bold>{repo.name}</Bold>
                <div className='grow text-right'>
                    <Button size='xs' onClick={disconnect} loading={disconnecting} disabled={disconnecting}>Disconnect</Button>
                </div>
            </div>
        </Card>
    )
}

export default function RepositorySettings({ repos: initialRepos }: { repos: Partial<Repo>[]}) {
    const [search, setSearch] = useState<string>('');
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [noSearcResults, setNoSearchResults] = useState<boolean>(false);
    const [repos, setRepos] = useState<Partial<Repo>[]>(initialRepos);

    const onSearch = useCallback(() => {
        setIsSearching(true);
        searchUserRepos(search)
            .then(data => {
                setSearchResults(data)
                if(!data.length) {
                    setNoSearchResults(true);
                }
            })
            .catch(error => console.error("Failed to search repos:", error))
            .finally(() => setIsSearching(false));
    }, [search]);

    const isRepoConnected = useCallback((repoId: string) => {
        return repos.some(repo => `${repo.repoId}` == repoId);
    }, [repos]);

    useEffect(() => {
        setRepos(initialRepos);
    }, [initialRepos]);

    useEffect(() => {
        // Set a timeout to delay the search
        const handler = setTimeout(() => {
            if (search.trim()) {
                onSearch();
            }
        }, 500); 

        // Clear the timeout if the search term changes before the delay is over or if the component is unmounted
        return () => {
            clearTimeout(handler);
        };
    }, [search, onSearch]);

    const clearSearch = useCallback(() => {
        setSearch('');
        setSearchResults([]);
        setNoSearchResults(false);
    }, []);


    return (
        <>
            <Card className="p-10">
                <Flex flexDirection="col" alignItems="start" className="gap-4">
                    <Flex flexDirection="col" alignItems="start" className="gap-4">
                        <h2 className="font-cal text-xl dark:text-white">Repos</h2>
                        <Text>
                            Repositories you have access to.
                        </Text>
                        
                            <div className='w-full relative'>
                                <TextInput icon={SearchIcon} placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                                { search?.length ?
                                    <div className="absolute right-2 top-2">
                                        <Button variant="light" icon={XCircle} onClick={clearSearch} loading={isSearching} disabled={isSearching} />
                                    </div>
                                    : null
                                }
                            </div>
                        
                    </Flex>
                    { searchResults.length ? 
                        <Flex flexDirection="col" className="w-full gap-0 border border-x-0 border-t-0">
                            {searchResults.map((repo : any, index: number) => (
                                <SearchResultRepo repo={repo} key={index} setRepos={setRepos} isConnected={isRepoConnected(repo.id)} />
                            ))}
                        </Flex>
                        : noSearcResults ?
                            <Text>No results found.</Text>
                            : null

                    }
                </Flex>
            </Card>

            <Text>Repo Settings</Text>
            <Card className="max-w w-full mx-auto">
                <Bold>Your Connected Github Repositories</Bold>
                <Text className="mb-4">These are the Github repositories for which you are currently a maintainer.</Text>
                <Grid numItems={2} className="gap-2 mb-4">
                    { repos.map((repo, index) => (
                        <RepoItem repo={repo} key={index} setRepos={setRepos}/>
                    ))}
                </Grid>
            </Card>
        </>
    )
}