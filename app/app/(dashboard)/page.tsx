import DashboardCharts from "@/components/dashboard/dashboard-charts";
import OnboardingGuide from "@/components/onboarding/onboarding-guide";
import PageHeading from "@/components/common/page-heading";
import SessionService from "@/app/services/SessionService";
import { CustomersTable } from "./customers/customer-table";
import { Bold } from "@tremor/react";
import Link from "next/link";

export default async function Overview() {
  const user = await SessionService.getSessionUser();
  const title = user?.name ? `Welcome, ${user.name}!` : "Your Dashboard";
  const onboarding = user?.onboarding;
  return (
    <>
      <div className="flex max-w-screen-xl flex-col">
        <div className="text-center">
          {onboarding ? <OnboardingGuide dashboard={true} /> : null}
        </div>
        <div className="flex flex-col space-y-6">
          <PageHeading title={title} />
          <div className="flex flex-col gap-8">
            <h3 className="text-xl font-bold">Latest Customers</h3>
            <CustomersTable maxInitialRows={5} />
            <DashboardCharts />
          </div>
        </div>
      </div>
    </>
  );
}
