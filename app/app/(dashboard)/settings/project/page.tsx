"use server";

import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserService from "@/app/services/UserService";
import BusinessSettings from "@/components/user/project-settings";

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
    <div className="space-y-6">
      <BusinessSettings user={user} />
    </div>
  );
}
