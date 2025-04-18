import PageHeader from "@/components/common/page-header";
import CustomerSettings from "@/components/user/customer-settings";

export default async function SettingsPage() {
  return (
    <div className="space-y-10 p-12 pt-10">
      <PageHeader title="Settings" />
      <CustomerSettings />
    </div>
  );
}
