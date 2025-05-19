import { requireUser } from "@/app/services/user-context-service";
import GeneralSettings from "@/components/user/general-settings";

export default async function GeneralSettingsPage() {
  const user = await requireUser();

  return (
    <div className="space-y-6">
      <GeneralSettings user={user} />
    </div>
  );
}
