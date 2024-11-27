import { ReactNode, Suspense } from "react";
import Profile from "@/components/profile";
import Nav from "@/components/nav";
import { redirect } from "next/navigation";
import { getOnlySiteFromUserId } from "@/app/services/SiteService";
import { Flex } from "@tremor/react";
import OnboardingGuide from "@/components/onboarding/onboarding-guide";
import { DashboardProvider } from "@/components/dashboard/dashboard-context";
import SessionService from "@/app/services/SessionService";
import StripeDisabledBanner from "@/components/common/stripe-disabled-banner";
import SessionRefresher from "@/components/common/session-refresher";
import FeatureService from "@/app/services/feature-service";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await SessionService.getSessionUser();
  const onboarding = user?.onboarding;
  if (!user?.id) {
    redirect("/login");
  }
  // console.log(onboarding)
  const site = await getOnlySiteFromUserId(user.id);
  const activeFeatures = await FeatureService.findActiveByCurrentUser();

  return (
    <DashboardProvider siteId={site?.id ?? null}>
      <SessionRefresher />
      <div>
        <Nav siteId={site?.id ?? null} roleId={user.roleId || 'anonymous'} hasFeatures={activeFeatures.length != 0} >
          <Suspense fallback={<div>Loading...</div>}>
            <Profile />
          </Suspense>
        </Nav>
        <div className="min-h-screen sm:pl-60">
          <Flex alignItems="stretch" className="w-full">
            <div className="flex flex-col gap-9 max-w-screen-xl grow p-8 mx-auto">
              {onboarding ? <OnboardingGuide /> : null }
              {user?.stripeAccountDisabled && user?.stripeAccountId && <StripeDisabledBanner /> }
              {children}
            </div>
          </Flex>
        </div>
      </div>
    </DashboardProvider>
  );
}
