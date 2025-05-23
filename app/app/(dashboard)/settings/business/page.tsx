"use server";

import { requireUser } from "@/app/services/user-context-service";
import BusinessSettings from "@/components/organization/business-settings";

export default async function ProjectSettingsPage() {
  const user = await requireUser();

  return (
    <div className="space-y-6">
      <BusinessSettings user={user} />
    </div>
  );
}
