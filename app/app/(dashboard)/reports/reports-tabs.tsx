import { DashboardCharts } from "@/components/overview-stats";
import type { CustomerWithChargesAndSubscriptions } from "@/types/dashboard";

export default function Reports({
  customers
}: {
  customers: CustomerWithChargesAndSubscriptions[];
}) {
  return <DashboardCharts customers={customers} />;
}
