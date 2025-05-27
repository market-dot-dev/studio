"use server";

import { requireOrganization } from "@/app/services/user-context-service";
import BusinessSettings from "@/components/organization/business-settings";

export default async function ProjectSettingsPage() {
  const org = await requireOrganization();

  return (
    <div className="space-y-6">
      <BusinessSettings organization={org} />
    </div>
  );
}
