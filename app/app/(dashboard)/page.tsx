import DashboardCharts from "@/components/dashboard/dashboard-charts";
import PageHeading from "@/components/common/page-heading";
import SessionService from "@/app/services/SessionService";
import { customersAndProspectsOfMaintainer } from "@/app/services/UserService";
import { redirect } from "next/navigation";
import SalesTable from "./customers/sales/sales-table";

export default async function Overview() {
  const user = await SessionService.getSessionUser();

  if (!user?.id) {
    redirect("/login");
  }

  const customers = await customersAndProspectsOfMaintainer(user.id);
  const title = user?.name ? `Welcome, ${user.name}` : "Your Dashboard";

  return (
    <div className="flex max-w-screen-xl flex-col space-y-6">
      <PageHeading title={title} />
      <div className="mb-10 flex flex-col">
        <SalesTable customersAndProspects={customers} maxInitialRows={5} />
        <DashboardCharts customers={customers} />
      </div>
    </div>
  );
}
