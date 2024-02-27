import DashboardCharts from "@/components/dashboard/dashboard-charts";
import LatestCustomersList from "@/components/dashboard/latest-customer-list";
import { getSession } from "@/lib/auth";
import OnboardingGuide from "@/components/onboarding/onboarding-guide";
import PageHeading from "@/components/common/page-heading";
import SessionService from "@/app/services/SessionService";
import StripeDisabledBanner from "@/components/common/stripe-disabled-banner";

export default async function Overview() {
  const session = await getSession();
  const title = session?.user.name ? `Welcome, ${session.user.name}!` : "Your Dashboard";

  const user = await SessionService.getSessionUser();

  return (
    <>
      <div className="flex max-w-screen-xl flex-col">
        <div className="text-center">
          <OnboardingGuide dashboard={true} />
        </div>
        <div className="text-center">
          <OnboardingGuide dashboard={true} />
        </div>
        <div className="flex flex-col space-y-6">
          <PageHeading title={title} />
          <div className="flex flex-col gap-8">
            { /* FIXME: reenable once banner is styled -- also need to health check on login or somesuch
              user?.stripeAccountDisabled && <StripeDisabledBanner /> */}

            <LatestCustomersList numRecords={3} previewMode={true} />
            <DashboardCharts />
          </div>
        </div>
      </div>
    </>
  );
}
