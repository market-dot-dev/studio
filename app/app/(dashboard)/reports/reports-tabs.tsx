import { DashboardCharts } from "@/components/overview-stats";
import { CustomerWithChargesAndSubscriptions } from "../customers/customer-table";

export default function Reports({
  customers
}: {
  customers: CustomerWithChargesAndSubscriptions[];
}) {
  return <DashboardCharts customers={customers} />;
}
