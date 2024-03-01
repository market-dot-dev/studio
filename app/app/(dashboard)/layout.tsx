import { ReactNode, Suspense } from "react";
import Profile from "@/components/profile";
import Nav from "@/components/nav";
import { redirect } from "next/navigation";
import { getOnlySiteFromUserId } from "@/app/services/SiteService";
import { Flex } from "@tremor/react";
import OnboardingGuide from "@/components/onboarding/onboarding-guide";
import { DasboardProvider } from "@/components/dashboard/dashboard-context";
import SessionService from "@/app/services/SessionService";
import StripeDisabledBanner from "@/components/common/stripe-disabled-banner";
import SessionRefresher from "@/components/common/session-refresher";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await SessionService.getSessionUser();

  if (!user?.id) {
    redirect("/login");
  }

  const site = await getOnlySiteFromUserId(user.id);

  return (
    <DasboardProvider siteId={site?.id ?? null}>
      <SessionRefresher />
      <div>
        <Nav siteId={site?.id ?? null} roleId={user.roleId || 'anonymous'}>
          <Suspense fallback={<div>Loading...</div>}>
            <Profile />
          </Suspense>
        </Nav>
        <div className="min-h-screen sm:pl-60">
          <Flex alignItems="stretch" className="w-full">
            <div className="max-w-screen-xl grow p-8">
              <OnboardingGuide />
              {user?.stripeAccountDisabled && user?.stripeAccountId && <StripeDisabledBanner /> }
              {children}
            </div>
          </Flex>
        </div>
      </div>
    </DasboardProvider>
  );
}
