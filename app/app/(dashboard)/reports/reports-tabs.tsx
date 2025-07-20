import { getCurrentVendorCustomers } from "@/app/services/organization/vendor-organization-service";
import { DashboardCharts } from "@/components/overview-stats";

export default function Reports({
  customers
}: {
  customers: Awaited<ReturnType<typeof getCurrentVendorCustomers>>;
}) {
  return <DashboardCharts customers={customers} />;
}
