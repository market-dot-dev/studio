import { requireOrganization } from "@/app/services/user-context-service";
import PageHeader from "@/components/common/page-header";
import { CustomerOrganizationSettingsForm } from "./customer-organization-settings-form";

export default async function CustomerSettingsPage() {
  const org = await requireOrganization();

  return (
    <div className="space-y-10 p-12 pt-10">
      <PageHeader title="Settings" />
      <CustomerOrganizationSettingsForm
        organization={{
          name: org.name,
          businessLocation: org.businessLocation
        }}
      />
    </div>
  );
}
