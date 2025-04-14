"use server";

import { getRepos } from "@/app/services/RepoService";
import RepositorySettings from "@/components/user/repository-settings";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RepositorySettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const repos = await getRepos();

  return (
    <div className="space-y-6">
      <RepositorySettings repos={repos} />
    </div>
  );
}
