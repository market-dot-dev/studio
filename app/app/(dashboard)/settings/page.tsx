"use server";

import { getCurrentOrganizationForSettings } from "@/app/services/organization/organization-service";
import { VendorOrganizationSettingsForm } from "./organization/vendor-organization-settings-form";

export default async function SettingsPage() {
  const org = await getCurrentOrganizationForSettings();

  return (
    <div className="w-full lg:max-w-screen-sm">
      <VendorOrganizationSettingsForm organization={org} />
    </div>
  );
}
