import { getCurrentOrganizationForSettings } from "@/app/services/organization/organization-service";
import PageHeader from "@/components/common/page-header";
import { CustomerOrganizationSettingsForm } from "./customer-organization-settings-form";

export default async function CustomerSettingsPage() {
  const org = await getCurrentOrganizationForSettings();

  return (
    <div className="space-y-10 p-12 pt-10">
      <PageHeader title="Settings" />
      <CustomerOrganizationSettingsForm organization={org} />
    </div>
  );
}
