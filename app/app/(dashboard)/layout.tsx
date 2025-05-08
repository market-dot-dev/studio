import Nav from "@/app/components/nav";
import { userIsMarketExpert } from "@/app/services/market-service";
import {
  defaultOnboardingState,
  OnboardingState
} from "@/app/services/onboarding/onboarding-steps";
import { getOnlySiteFromUserId } from "@/app/services/site-crud-service";
import UserService from "@/app/services/UserService";
import SessionRefresher from "@/components/common/session-refresher";
import { StripeDisabledBanner } from "@/components/common/stripe-disabled-banner";
import { DashboardProvider } from "@/components/dashboard/dashboard-context";
import Header from "@/components/header/header";
import OnboardingModal from "@/components/onboarding/onboarding-modal";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function DashboardLayout(props: { children: ReactNode }) {
  const { children } = props;

  const user = await UserService.getCurrentUser();
  if (!user?.id) {
    redirect("/login");
  }

  // Check if the user is a market expert once at load time
  const isMarketExpert = await userIsMarketExpert();

  const onboarding = user.onboarding
    ? (JSON.parse(user.onboarding) as OnboardingState)
    : defaultOnboardingState;

  const site = await getOnlySiteFromUserId(user.id);
  const showOnboardingModal = !onboarding.setupBusiness || !onboarding.preferredServices;

  return (
    <DashboardProvider siteId={site?.id ?? null} initialExpertStatus={isMarketExpert}>
      <SessionRefresher />
      <OnboardingModal user={user} currentSite={site ?? undefined} onboardingState={onboarding} />
      <div>
        <Header />
        <div className="pt-10">
          <Nav
            siteId={site?.id ?? null}
            roleId={user.roleId || "anonymous"}
            onboarding={onboarding}
            showOnboardingModal={showOnboardingModal}
          />
          <div className="flex min-h-screen w-full flex-col items-center bg-stone-100 md:pl-[var(--navWidth)]">
            {user?.stripeAccountDisabled && <StripeDisabledBanner />}
            <div className="flex w-full max-w-screen-xl flex-col items-center space-y-4 p-6 sm:p-10 sm:pt-8">
              {/* {!onboarding.isDismissed && !showOnboardingModal && <OnboardingChecklist />} */}
              <div className="relative flex w-full flex-col gap-8">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}
