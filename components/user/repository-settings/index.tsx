'use client'
import { getInstallationsList, getInstallationRepos, getGithubAppInstallState } from "@/app/services/RepoService";
import { Repo } from "@prisma/client";
import { SearchSelect, SearchSelectItem, Icon } from "@tremor/react";
import { Button } from "@/components/ui/button";

import { Github, SearchIcon, X } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";

import LoadingSpinner from "../../form/loading-spinner";
import { Card } from "@/components/ui/card";
import { RepoItem, SearchResultRepo } from "./repo-items";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        <div className="flex flex-row gap-4">
          <div className="w-2/5 ps-2 pt-2">
            <div className="flex flex-col items-start gap-4">
              <div className="w-full">
                <strong>Github Accounts</strong>
                <p className="text-sm text-stone-500">
                  Your Github accounts and organizations in which you are a
                  member.
                </p>
                <div className="relative mt-2 flex w-full items-center">
                  <SearchSelect onValueChange={handleInstallationSelect}>
                    <div
                      key="add-github-account"
                      className="flex w-full cursor-pointer items-center justify-start p-2"
                      onClick={handleAddAccount}
                    >
                      + Add Github Account
                    </div>
                    {installations.map((installation, index) => (
                      <SearchSelectItem
                        value={`${installation.id}`}
                        key={index}
                      >
                        <div className="flex items-center">
                          <Icon icon={Github} />{" "}
                          <p className="text-sm text-stone-500">
                            {installation.login}
                          </p>
                        </div>
                      </SearchSelectItem>
                    ))}
                  </SearchSelect>
                  {isPendingInstallationsList ? <LoadingSpinner /> : null}
                </div>
              </div>

              <div className="relative w-full">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="search">Repositories</Label>
                  <div className="relative  w-full">
                    <Input
                      id="search"
                      icon={<SearchIcon />}
                      placeholder="Filter..."
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    />
                    {filter?.length ? (
                      <div className="absolute inset-0 left-auto">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setFilter("")}
                        >
                          <X className="!size-4 text-stone-400 hover:text-stone-600" />
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
                {isPendingInstallationRepos ? (
                  <LoadingSpinner className="mx-auto" />
                ) : null}
                {installations.find(
                  ({ id }) => `${id}` === currentInstallationId,
                ) && installationRepos?.length ? (
                  <div className="flex w-full flex-col gap-0">
                    {filteredInstallationRepos.map(
                      (repo: Repo, index: number) => (
                        <SearchResultRepo
                          repo={repo}
                          key={index}
                          setRepos={setRepos}
                          installationId={currentInstallationId}
                          isConnected={isRepoConnected(repo.id)}
                        />
                      ),
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <Card className="w-4/5 p-6 pt-5">
            <strong>Connected Github Repositories</strong>
            <p className="text-sm text-stone-500">
              {" "}
              A Connected repository is a loose connection - this allows you to
              do research dependents your open source projects.
            </p>
            {repos.length === 0 && (
              <p className="text-sm text-stone-500">
                No connected repositories. Connect a Github account on the left
                and select repositories to link.
              </p>
            )}
            <div className="mb-4 grid grid-cols-1 gap-2">
              {repos.map((repo, index) => (
                <RepoItem repo={repo} key={index} setRepos={setRepos} />
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
}