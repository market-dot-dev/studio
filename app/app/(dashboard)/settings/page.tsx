"use server";

import { getCurrentSite } from "@/app/services/site/site-crud-service";
import { requireOrganization } from "@/app/services/user-context-service";
import { VendorOrganizationSettingsForm } from "./organization/vendor-organization-settings-form";

export default async function SettingsPage() {
  const org = await requireOrganization();
  const site = await getCurrentSite();

  return (
    <div className="w-full lg:max-w-screen-sm">
      <VendorOrganizationSettingsForm
        organization={{
          name: org.name,
          description: org.description,
          businessLocation: org.businessLocation,
          subdomain: site?.subdomain || undefined,
          logo: site?.logo || undefined
        }}
      />
    </div>
  );
}
