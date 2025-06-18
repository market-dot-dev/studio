import {
  getCustomersOfVendor,
  getProspectsOfVendor
} from "@/app/services/organization/vendor-organization-service";
import { requireOrganization, requireUserSession } from "@/app/services/user-context-service";
import PageHeader from "@/components/common/page-header";
import DashboardCharts from "@/components/dashboard/dashboard-charts";
import DashboardCustomerTable from "./customers/sales/dashboard-customer-table";
import DashboardProspectTable from "./customers/sales/dashboard-prospect-table";

export default async function Overview() {
  const user = await requireUserSession();
  const org = await requireOrganization();
  const customers = await getCustomersOfVendor(org.id);
  const prospects = await getProspectsOfVendor(org.id);
  const title = user.name ? `Welcome ${user.name}` : "Your Dashboard";

  return (
    <div className="flex max-w-screen-xl flex-col space-y-10">
      <PageHeader title={title} />
      <DashboardCustomerTable customers={customers} maxInitialRows={5} />
      <DashboardProspectTable prospects={prospects} maxInitialRows={5} />
      <DashboardCharts customers={customers} />
    </div>
  );
}
