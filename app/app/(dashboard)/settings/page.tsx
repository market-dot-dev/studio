"use server";

import { getCurrentOrganizationForSettings } from "@/app/services/organization/organization-service";
import { VendorOrganizationSettingsForm } from "./organization/vendor-organization-settings-form";

export default async function SettingsPage() {
  const org = await getCurrentOrganizationForSettings();

  return (
    <div className="flex w-full flex-col gap-8">
      <h2 className="text-xl font-bold">Organization Info</h2>
      <VendorOrganizationSettingsForm organization={org} />
    </div>
  );
}
