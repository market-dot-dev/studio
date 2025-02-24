import { ReactNode } from "react";
import Nav from "@/app/components/nav";
import Header from "@/components/header/header";
import { redirect } from "next/navigation";
import { getOnlySiteFromUserId } from "@/app/services/SiteService";
import OnboardingChecklist from "@/components/onboarding/onboarding-checklist";
import { DashboardProvider } from "@/components/dashboard/dashboard-context";
import StripeDisabledBanner from "@/components/common/stripe-disabled-banner";
import SessionRefresher from "@/components/common/session-refresher";
import FeatureService from "@/app/services/feature-service";
import UserService from "@/app/services/UserService";
import {
  defaultOnboardingState,
  OnboardingState,
} from "@/app/services/onboarding/onboarding-steps";
import OnboardingModal from "@/components/onboarding/onboarding-modal";
import { MarketService } from "@/app/services/market-service";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: any;
}) {
  const user = await UserService.getCurrentUser();
  if (!user?.id) {
    redirect("/login");
  }

  const isMarketExpert = (await MarketService.getExpert()) != null;

  const onboarding = user.onboarding
    ? (JSON.parse(user.onboarding) as OnboardingState)
    : defaultOnboardingState;

  const site = await getOnlySiteFromUserId(user.id);
  const activeFeatures = await FeatureService.findActiveByCurrentUser();
  const showOnboardingModal =
    !onboarding.setupBusiness || !onboarding.preferredServices;

  const segments = params?.segments || [];

  return (
    <DashboardProvider siteId={site?.id ?? null}>
      <SessionRefresher />
      <OnboardingModal
        user={user}
        currentSite={site ?? undefined}
        onboardingState={onboarding}
      />
      <div>
        <Header />
        <div className="pt-10">
          <Nav
            siteId={site?.id ?? null}
            roleId={user.roleId || "anonymous"}
            hasFeatures={activeFeatures.length != 0}
            isMarketExpert={isMarketExpert}
            onboarding={onboarding}
            showOnboardingModal={showOnboardingModal}
          />
          <div className="flex min-h-screen w-full flex-col items-center bg-stone-50 md:pl-60">
            <div className="flex w-full max-w-screen-xl flex-col items-center space-y-4 p-6 sm:p-10 sm:pt-8">
              {!onboarding.isDismissed && !showOnboardingModal && (
                <OnboardingChecklist />
              )}
              {user?.stripeAccountDisabled && user?.stripeAccountId && (
                <StripeDisabledBanner />
              )}
              <div className="relative flex w-full flex-col gap-8">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}
