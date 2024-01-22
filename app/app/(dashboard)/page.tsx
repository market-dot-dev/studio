import DashboardCharts from "@/components/analytics/dashboard-charts";
import CustomersListPreview from "@/components/dashboard/customer-list-preview";
import { Bold } from "@tremor/react";
import { Suspense } from "react";
import Sites from "@/components/sites";
import OverviewStats from "@/components/overview-stats";
import Posts from "@/components/posts";
import { getSession } from "@/lib/auth";
import PlaceholderCard from "@/components/placeholder-card";
import OnboardingGuide from "@/components/onboarding/onboarding-guide";



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
          Business Overview
        </h1>
        <CustomersListPreview />
      </div>
    </div>
    <DashboardCharts />
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
    </div>
    </>
  );
}
