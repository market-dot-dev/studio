import PageHeading from "@/components/common/page-heading";
import CustomerSettings from "@/components/user/customer-settings";

export default async function SettingsPage() {
    return (
        <div className="space-y-12 p-8">
            <PageHeading title="User Settings" />
            <CustomerSettings />
        </div>
    );
}