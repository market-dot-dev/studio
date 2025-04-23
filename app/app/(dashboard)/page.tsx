import { getCustomersAndProspectsByMaintainer } from "@/app/services/customer-service";
import SessionService from "@/app/services/session-service";
import PageHeader from "@/components/common/page-header";
import DashboardCharts from "@/components/dashboard/dashboard-charts";
import { redirect } from "next/navigation";
import SalesTable from "./customers/sales/sales-table";

export default async function Overview() {
  const user = await SessionService.getSessionUser();

  if (!user?.id) {
    redirect("/login");
  }

  const customers = await getCustomersAndProspectsByMaintainer(user.id);
  const title = user?.name ? `Welcome ${user.name}` : "Your Dashboard";

  return (
    <div className="flex max-w-screen-xl flex-col space-y-10">
      <PageHeader title={title} />
      <SalesTable customersAndProspects={customers} maxInitialRows={5} />
      <DashboardCharts customers={customers} />
    </div>
  );
}
