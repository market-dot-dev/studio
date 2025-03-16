import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserService from "@/app/services/UserService";
import GeneralSettings from "@/components/user/general-settings";

export default async function GeneralSettingsPage() {
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
        <GeneralSettings user={user} />
    </div>
    
  );
}
