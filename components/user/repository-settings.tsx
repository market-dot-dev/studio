'use client'
import { verifyAndConnectRepo, disconnectRepo } from "@/app/services/RepoService";
import { Repo } from "@prisma/client";
import { Card, Flex, Text, TextInput, Button, Grid, Col, Bold, SearchSelect, SearchSelectItem, Icon } from "@tremor/react";

import { Github, SearchIcon, XCircle, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getInstallationsList, getInstallationRepos } from "@/app/services/RepoService";

import LoadingSpinner from "../form/loading-spinner";
import DashboardCard from "../common/dashboard-card";
const appName = process.env.NEXT_PUBLIC_GITHUB_APP_NAME;
type Installation = {
    id: string;
    account: string;
    accountType: string;
}

function SearchResultRepo({ repo, setRepos, isConnected }: { repo: any, setRepos: any, isConnected: boolean }) {

    const [connecting, setConnecting] = useState<boolean>(false);

    const connect = useCallback(() => {
        setConnecting(true);
        verifyAndConnectRepo(repo.id)
            .then((newRepo: Partial<Repo>) => {
                setRepos((currentRepos: Partial<Repo>[]) => [...currentRepos, newRepo]);

            })
            .catch(error => console.error("Failed to connect repo:", error))
            .finally(() => setConnecting(false));
    }, [repo.id, setRepos]);

    const classNames = "p-2 border-bottom" + (isConnected ? " opacity-50" : "");

    return (
        <Flex className={classNames}>
            <Flex justifyContent="start" className="grow">
                <Github size={16} className="me-2" />
                <Text className="text-sm">{repo.name}</Text>
            </Flex>
            <div className="text-right">
                <Button size="xs" onClick={connect} loading={connecting} disabled={isConnected || connecting}>{isConnected ? 'Connected' : 'Connect'}</Button>
            </div>
        </Flex>
    )
}

function RepoItem({ repo, setRepos }: { repo: Partial<Repo>, setRepos: any }) {
    const [disconnecting, setDisconnecting] = useState<boolean>(false);

    const disconnect = useCallback(() => {
        if (!repo.repoId) return;

        setDisconnecting(true);
        disconnectRepo(repo.repoId)
            .then(() => {
                setRepos((currentRepos: Partial<Repo>[]) => currentRepos.filter(item => item.repoId !== repo.repoId));
            })
            .catch(error => console.error("Failed to disconnect repo:", error))
            .finally(() => setDisconnecting(false));
    }, [repo.repoId, setRepos]);

    return (
        <div className="flex flex-row justify-items-center text-center">
                <Github size={16} className="me-2" />
                <Text>{repo.name}</Text>
                <div className='grow text-right'>
                    <Button size='xs' onClick={disconnect} loading={disconnecting} disabled={disconnecting}>Disconnect</Button>
                </div>
        </div>
    )
}

let filterTimeout: any;

export default function RepositorySettings({ repos: initialRepos }: { repos: Partial<Repo>[] }) {
    const [installationRepos, setInstallationRepos] = useState<any[]>([]);
    const [repos, setRepos] = useState<Partial<Repo>[]>(initialRepos);
    const [installations, setInstallations] = useState<Installation[]>([]);
    const [stateVariable, setStateVariable] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>('');
    const [filteredInstallationRepos, setFilteredInstallationRepos] = useState<any[]>([]);


    const isRepoConnected = useCallback((repoId: string) => {
        return repos.some(repo => `${repo.repoId}` == repoId);
    }, [repos]);

    useEffect(() => {
        setRepos(initialRepos);
    }, [initialRepos]);

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

    useEffect(() => {

        getInstallationsList().then(({ state, data }: { state: string, data: Installation[] }) => {
            setStateVariable(state);
            setInstallations(data);
        })
            .catch(error => console.error("Failed to get installations:", error))

    }, [])

    const handleAddAccount = useCallback(() => {
        const appInstallationWindow = window.open(`https://github.com/apps/${appName}/installations/select_target?state=${stateVariable}`, '_blank', 'width=800,height=600');
        if (appInstallationWindow) {
            const checkWindow = setInterval(function () {
                if (appInstallationWindow.closed) {
                    clearInterval(checkWindow); // Stop checking
                    getInstallationsList().then(({ state, data }: { state: string, data: Installation[] }) => {
                        setStateVariable(state);
                        setInstallations(data);
                    }).catch(error => console.error("Failed to get installations:", error))

                }
            }, 1000);
        }
    }, [stateVariable]);

    const handleInstallationSelect = useCallback((installationId: string) => {
        setLoading(true);
        setInstallationRepos([]);
        getInstallationRepos(parseInt(installationId))
            .then((repos) => {
                setInstallationRepos(repos);
                setFilter('');
                setFilteredInstallationRepos(repos);
            })
            .catch(error => console.error("Failed to get installation repos:", error))
            .finally(() => setLoading(false));
    }, []);


    return (
        <div className="flex flex-row gap-4">
            <div className="w-2/5 pt-2 ps-2">
                <Flex flexDirection="col" alignItems="start" className="gap-4">
                    <div className="w-full">
                        <Bold>Github Accounts</Bold>
                        <Text>Your Github accounts and organizations in which you are a member.</Text>
                        <div className='mt-2 w-full relative'>
                            <SearchSelect onValueChange={handleInstallationSelect}>
                            <div key='add-github-account' className="w-full p-2 cursor-pointer flex items-center justify-start" onClick={handleAddAccount}>
                                    + Add Github Account
                                </div>
                                {installations.map((installation, index) => (
                                    <SearchSelectItem value={installation.id} key={index}>
                                        <Flex alignItems="center">
                                            <Icon icon={Github} /> <Text>{installation.account}</Text>
                                        </Flex>
                                    </SearchSelectItem>
                                ))}

                            </SearchSelect>
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
                        {loading ?
                            <div className="w-full text-center">
                                <LoadingSpinner />
                            </div> : null
                        }
                        {installationRepos.length ?
                            <Flex flexDirection="col" className="w-full gap-0">
                                {filteredInstallationRepos.map((repo: any, index: number) => (
                                    <SearchResultRepo repo={repo} key={index} setRepos={setRepos} isConnected={isRepoConnected(repo.id)} />
                                ))}
                            </Flex>
                            : null
                        }
                    </div>
                </Flex>
            </div>

            <DashboardCard className="w-4/5">
                <Bold>Connected Github Repositories</Bold>
                <Text className="mb-4"> A Connected repository is a loose connection, and are used to set up your Gitwallet Site.</Text>
                {repos.length === 0 && <Text>No connected repositories. Connect a Github account on the left and select repositories to link.</Text>}
                <Grid numItems={1} className="gap-2 mb-4">
                    {repos.map((repo, index) => (
                        <RepoItem repo={repo} key={index} setRepos={setRepos} />
                    ))}
                </Grid>
            </DashboardCard>
        </div>
    )
}