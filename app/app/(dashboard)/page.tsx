import DashboardCharts from "@/components/dashboard/dashboard-charts";
import LatestCustomersList from "@/components/dashboard/customer-list";
import { Button, Bold } from "@tremor/react";
import { getSession } from "@/lib/auth";
import OnboardingGuide from "@/components/onboarding/onboarding-guide";
import DashboardCard from "@/components/common/dashboard-card";

export default async function Overview() {
  const session = await getSession();

  return (
    <>
      <div className="flex max-w-screen-xl flex-col space-y-12 py-4 px-6">
        <div className="text-center">
          <OnboardingGuide dashboard={true} />
        </div>
        <div className="flex flex-col space-y-6">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            {session?.user.name ? <Bold>Welcome, {session.user.name}!</Bold> : "Your Dashboard"}
          </h1>
          <DashboardCard>
            <LatestCustomersList numRecords={5} previewMode={true} />
          </DashboardCard>
          <div className="grid justify-items-end">
            <Button size="xs" className="h-6" variant="secondary">
              All Customers →
            </Button>
          </div>

        </div>
      </div>
      <DashboardCharts />
      <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      </div>
    </>
  );
}
