"use server";


import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import RepositorySettings from "@/components/user/repository-settings";
import { getRepos } from "@/app/services/RepoService";
import { Title } from "@tremor/react";

export default async function RepositorySettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }
  

  const repos = await getRepos();
  // console.log(app);

  return (    
    <div className="space-y-6">
      <Title>Your Github Repositories</Title>
      <RepositorySettings repos={repos}/>
  </div>
  );
}
