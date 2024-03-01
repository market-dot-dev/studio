import DashboardCharts from "@/components/dashboard/dashboard-charts";
import LatestCustomersList from "@/components/dashboard/latest-customer-list";
import OnboardingGuide from "@/components/onboarding/onboarding-guide";
import PageHeading from "@/components/common/page-heading";
import SessionService from "@/app/services/SessionService";

export default async function Overview() {
  const user = await SessionService.getSessionUser();
  const title = user?.name ? `Welcome, ${user.name}!` : "Your Dashboard";

  return (
    <>
      <div className="flex max-w-screen-xl flex-col">
        <div className="text-center">
          <OnboardingGuide dashboard={true} />
        </div>
        <div className="flex flex-col space-y-6">
          <PageHeading title={title} />
          <div className="flex flex-col gap-8">
            <LatestCustomersList numRecords={3} previewMode={true} />
            <DashboardCharts />
          </div>
        </div>
      </div>
    </>
  );
}
