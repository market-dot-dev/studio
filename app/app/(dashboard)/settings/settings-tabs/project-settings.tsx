"use server";

import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserService from "@/app/services/UserService";
import PageHeading from "@/components/common/page-heading";
import ProjectSettings from "@/components/user/project-settings";


export default async function ProjectSettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = await UserService.findUser(session.user.id!);

  if (!user) {
    redirect("/login");
  }

  return (    
    <div className="space-y-12 p-8">
      <PageHeading title="Project Settings" />
      <ProjectSettings user={user} />
  </div>
  );
}
