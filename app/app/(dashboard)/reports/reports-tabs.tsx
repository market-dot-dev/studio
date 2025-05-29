import { DashboardCharts } from "@/components/overview-stats";
import type { CustomerOrgWithChargesAndSubs } from "@/types/organization-customer";

export default function Reports({ customers }: { customers: CustomerOrgWithChargesAndSubs[] }) {
  return <DashboardCharts customers={customers} />;
}
