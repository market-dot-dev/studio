import { requireOrganization, requireUser } from "@/app/services/user-context-service";
import PageHeader from "@/components/common/page-header";
import CustomerSettings from "@/components/organization/customer-settings";

export default async function SettingsPage() {
  const user = await requireUser();
  const org = await requireOrganization();
  return (
    <div className="space-y-10 p-12 pt-10">
      <PageHeader title="Settings" />
      <CustomerSettings user={user} organization={org} />
    </div>
  );
}
