"use client";
import { disconnectRepo, verifyAndConnectRepo } from "@/app/services/RepoService";
import { Button } from "@/components/ui/button";
import { gitHubRepoOrgAndName } from "@/lib/utils";
import { Repo } from "@prisma/client";
import { Github } from "lucide-react";
import { useCallback, useState } from "react";

export function SearchResultRepo({
  repo,
  setRepos,
  isConnected,
  installationId
}: {
  repo: Repo;
  setRepos: any;
  isConnected: boolean;
  installationId: string | null;
}) {
  const [connecting, setConnecting] = useState<boolean>(false);

  const connect = useCallback(() => {
    if (!repo.id || !installationId) return;

    setConnecting(true);
    verifyAndConnectRepo(repo.id, installationId)
      .then((newRepo: Partial<Repo>) => {
        setRepos((currentRepos: Partial<Repo>[]) => [...currentRepos, newRepo]);
      })
      .catch((error) => console.error("Failed to connect repo:", error))
      .finally(() => setConnecting(false));
  }, [repo.id, setRepos]);

  const classNames = "p-2 border-bottom" + (isConnected ? " opacity-50" : "");

  return (
    <div className={`flex items-center justify-center ${classNames}`}>
      <div className="flex grow items-center justify-start">
        <Github size={16} className="me-2" />
        <p className="text-sm text-stone-500">{repo.name}</p>
      </div>
      {isConnected ? (
        <Button
          size="sm"
          onClick={connect}
          loading={connecting}
          disabled={isConnected || connecting}
        >
          Connect
        </Button>
      ) : (
        <div className="flex items-center gap-1.5 text-sm font-medium text-green-600">
          <span className="size-1.5 rounded-full bg-green-600"></span>
          Connected
        </div>
      )}
    </div>
  );
}

export function RepoItem({ repo, setRepos }: { repo: Partial<Repo>; setRepos: any }) {
  const [disconnecting, setDisconnecting] = useState<boolean>(false);

  const disconnect = useCallback(() => {
    if (!repo.repoId) return;

    setDisconnecting(true);
    disconnectRepo(repo.repoId)
      .then(() => {
        setRepos((currentRepos: Partial<Repo>[]) =>
          currentRepos.filter((item) => item.repoId !== repo.repoId)
        );
      })
      .catch((error) => console.error("Failed to disconnect repo:", error))
      .finally(() => setDisconnecting(false));
  }, [repo.repoId, setRepos]);

  const repoOrgName = gitHubRepoOrgAndName(repo.url);
  return (
    <div className="flex flex-row justify-items-center text-center">
      <Github size={16} className="me-2" />
      <p className="text-sm text-stone-500">{repoOrgName || repo.name}</p>
      <div className="grow text-right">
        <Button size="sm" variant="outline" loading={disconnecting} onClick={disconnect}>
          Disconnect
        </Button>
      </div>
    </div>
  );
}
