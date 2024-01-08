import DashboardCharts from "@/components/analytics/monthly-revenue-barchart";
import DashboardCard from "@/components/common/dashboard-card";
import CustomersListPreview from "@/components/dashboard/customer-list-preview";
import { Bold } from "@tremor/react";

export default async function Overview() {
  return (
    <>
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          Overview
        </h1>
        <CustomersListPreview />

      </div>
    </div>
    <DashboardCharts />
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      </div>
    </>
  );
}
