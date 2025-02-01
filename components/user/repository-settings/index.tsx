'use client'
import { getInstallationsList, getInstallationRepos, getGithubAppInstallState } from "@/app/services/RepoService";
import { Repo } from "@prisma/client";
import { Flex, Text, TextInput, Button, Grid, Bold, SearchSelect, SearchSelectItem, Icon } from "@tremor/react";

import { Github, SearchIcon, XCircle } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";

import LoadingSpinner from "../../form/loading-spinner";
import DashboardCard from "../../common/dashboard-card";
import { RepoItem, SearchResultRepo } from "./repo-items";

const appName = process.env.NEXT_PUBLIC_GITHUB_APP_NAME;

type Installation = {
    id: number;
    login: string | null; // null because of backward compatibility
}

// timeout for throttling the filtering of repos
let filterTimeout: any;

export default function RepositorySettings({ repos: initialRepos }: { repos: Partial<Repo>[] }) {
    const [installationRepos, setInstallationRepos] = useState<Repo[]>([]);
    const [repos, setRepos] = useState<Partial<Repo>[]>(initialRepos);
    const [installations, setInstallations] = useState<Installation[]>([]);
    const [stateVariable, setStateVariable] = useState<string>('');
    
    const [filter, setFilter] = useState<string>('');
    const [filteredInstallationRepos, setFilteredInstallationRepos] = useState<Repo[]>([]);
    const [currentInstallationId, setCurrentInstallationId] = useState<string | null>(null);
    // const [error, setError] = useState<string>('');
    const [isPendingInstallationsList, startTransitionInstallationsList] = useTransition();
    const [isPendingInstallationRepos, startTransitionInstallationRepos] = useTransition();


    const isRepoConnected = useCallback((repoId: string) => {
        return repos.some(repo => `${repo.repoId}` == repoId);
    }, [repos]);


    const handleGetInstallations = useCallback(() => {
        startTransitionInstallationsList(() => {
            getInstallationsList()
                .then((data) => {
                    setInstallations(data);
                })
                .catch(error => {
                    console.error("Failed to get installations:", error);
                });
        });
    }, [getInstallationsList, setInstallations, startTransitionInstallationsList]);


    // handle installing of github app on a new account
    const handleAddAccount = useCallback(() => {
        const appInstallationWindow = window.open(`https://github.com/apps/${appName}/installations/select_target?state=${stateVariable}`, '_blank', 'width=800,height=600');
        if (appInstallationWindow) {
            const checkWindow = setInterval(function () {
                if (appInstallationWindow.closed) {
                    clearInterval(checkWindow); 
                    handleGetInstallations();
                }
            }, 1000);
        }
    }, [stateVariable]);

    // get repos of a given installation
    const handleInstallationSelect = useCallback((installationId: string) => {
        
        setCurrentInstallationId(installationId);
        setInstallationRepos([]);
        startTransitionInstallationRepos(() => {
            getInstallationRepos(parseInt(installationId))
            .then((repos) => {
                setInstallationRepos(repos);
                setFilter('');
                setFilteredInstallationRepos(repos);
            })
            .catch(error => console.error("Failed to get installation repos:", error))
        });
            
    }, [setCurrentInstallationId, setInstallationRepos, startTransitionInstallationRepos, getInstallationRepos]);

    // filter the repos based on the filter value
    useEffect(() => {

        if (filterTimeout) {
            clearTimeout(filterTimeout);
        }

        filterTimeout = setTimeout(() => {
            if (!filter) {
                setFilteredInstallationRepos(installationRepos);
                return;
            }

            setFilteredInstallationRepos(installationRepos.filter(repo => repo.name.toLowerCase().includes(filter.toLowerCase())));
        }, 500);

    }, [filter])

    // get the installations list, and the state variable, ensuring that the state variable is unique for a set of installations among other things
    useEffect(() => {
        getGithubAppInstallState().then((state: string) => {
            setStateVariable(state);
        })
        .catch(error => console.error("Failed to get state variable:", error))

       handleGetInstallations();

    }, [])


    return (
        <div className="flex flex-col items-stretch gap-4">
            {/* { error ? <Text className="text-red-500">{error}</Text> : null } */}
            <div className="flex flex-row gap-4">
                <div className="w-2/5 pt-2 ps-2">
                    <Flex flexDirection="col" alignItems="start" className="gap-4">
                        <div className="w-full">
                            <Bold>Github Accounts</Bold>
                            <Text>Your Github accounts and organizations in which you are a member.</Text>
                            <div className='mt-2 flex items-center w-full relative'>
                                    <SearchSelect onValueChange={handleInstallationSelect}>
                                        <div key='add-github-account' className="w-full p-2 cursor-pointer flex items-center justify-start" onClick={handleAddAccount}>
                                            + Add Github Account
                                        </div>
                                        {installations.map((installation, index) => (
                                            <SearchSelectItem value={`${installation.id}`} key={index}>
                                                <Flex alignItems="center">
                                                    <Icon icon={Github} /> <Text>{installation.login}</Text>
                                                </Flex>
                                            </SearchSelectItem>
                                        ))}
                                        

                                    </SearchSelect>
                                    { isPendingInstallationsList ? <LoadingSpinner/> : null }
                                
                            </div>
                        </div>

                        <div className='w-full relative'>
                            <Bold>Repositories</Bold>
                            <div className='mt-2 w-full relative'>
                                <TextInput icon={SearchIcon} placeholder="Filter..." value={filter} onChange={(e) => setFilter(e.target.value)} />
                                {filter?.length ?
                                    <div className="absolute right-2 top-2">
                                        <Button variant="light" icon={XCircle} onClick={() => setFilter('')} />
                                    </div>
                                    : null
                                }
                            </div>
                            {isPendingInstallationRepos ?   
                                <LoadingSpinner className="mx-auto" />
                                 : null
                            }
                            {installations.find(({id}) => `${id}` === currentInstallationId) && installationRepos?.length ?
                                <Flex flexDirection="col" className="w-full gap-0">
                                    {filteredInstallationRepos.map((repo: Repo, index: number) => (
                                        <SearchResultRepo repo={repo} key={index} setRepos={setRepos} installationId={currentInstallationId} isConnected={isRepoConnected(repo.id)} />
                                    ))}
                                </Flex>
                                : null
                            }
                        </div>
                    </Flex>
                </div>

                <DashboardCard className="w-4/5">
                    <Bold>Connected Github Repositories</Bold>
                    <Text className="mb-4"> A Connected repository is a loose connection - this allows you to do research dependents your open source projects.</Text>
                    {repos.length === 0 && <Text>No connected repositories. Connect a Github account on the left and select repositories to link.</Text>}
                    <Grid numItems={1} className="gap-2 mb-4">
                        {repos.map((repo, index) => (
                            <RepoItem repo={repo} key={index} setRepos={setRepos} />
                        ))}
                    </Grid>
                </DashboardCard>
            </div>
        </div>
    )
}