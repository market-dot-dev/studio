import DashboardCharts from "@/components/dashboard/dashboard-charts";
import LatestCustomersList from "@/components/dashboard/customer-list";
import { Button, Bold } from "@tremor/react";
import { getSession } from "@/lib/auth";
import OnboardingGuide from "@/components/onboarding/onboarding-guide";
import PageHeading from "@/components/common/page-heading";

export default async function Overview() {
  const session = await getSession();
  const title = session?.user.name ? `Welcome, ${session.user.name}!` : "Your Dashboard";

  return (
    <>
      <div className="flex max-w-screen-xl flex-col">
        <div className="text-center">
          <OnboardingGuide dashboard={true} />
        </div>
        <div className="flex flex-col space-y-6">
          <PageHeading title={title} />
          
          <LatestCustomersList numRecords={5} previewMode={true} />
        </div>
      </div>
      <DashboardCharts />
    </>
  );
}
