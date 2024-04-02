'use client'
import { verifyAndConnectRepo, disconnectRepo } from "@/app/services/RepoService";
import { Repo } from "@prisma/client";
import { Flex, Text, Button } from "@tremor/react";
import { Github } from "lucide-react";
import { useState, useCallback } from "react";

export function SearchResultRepo({ repo, setRepos, isConnected }: { repo: Repo, setRepos: any, isConnected: boolean }) {

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

export function RepoItem({ repo, setRepos }: { repo: Partial<Repo>, setRepos: any }) {
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