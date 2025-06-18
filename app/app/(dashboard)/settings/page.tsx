"use server";

import { getFullOrganizationById } from "@/app/services/organization-service";
import { getCurrentSite } from "@/app/services/site/site-crud-service";
import { requireOrganization } from "@/app/services/user-context-service";
import BusinessSettings from "@/components/organization/business-settings";

export default async function SettingsPage() {
  const org = await requireOrganization();
  const fullOrg = await getFullOrganizationById(org.id);

  if (!fullOrg) {
    throw new Error("Organization not found");
  }

  const site = await getCurrentSite();

  return (
    <div className="space-y-6">
      <BusinessSettings
        organization={{
          name: fullOrg.name,
          description: fullOrg.description,
          businessLocation: fullOrg.businessLocation,
          subdomain: site?.subdomain || undefined,
          logo: site?.logo || undefined
        }}
      />
    </div>
  );
}
