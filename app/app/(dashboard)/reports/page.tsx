import { customers as getCustomersData } from "@/app/services/UserService";
import PageHeader from "@/components/common/page-header";
import RevenueReports from "./reports-tabs";

export default async function ReportsPage() {
  const customers = await getCustomersData();

  return (
    <div className="flex max-w-screen-xl flex-col space-y-10">
      <PageHeader title="Reports" />
      <RevenueReports customers={customers} />
    </div>
  );
}
