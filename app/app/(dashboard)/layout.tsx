import { ReactNode } from "react";
import Nav from "@/components/nav";
import Header from '@/components/header/header'
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

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await UserService.getCurrentUser();
  if (!user?.id) {
    redirect("/login");
  }

  const onboarding = user.onboarding
    ? (JSON.parse(user.onboarding) as OnboardingState)
    : defaultOnboardingState;

  const site = await getOnlySiteFromUserId(user.id);
  const activeFeatures = await FeatureService.findActiveByCurrentUser();
  const showOnboardingModal =
    !onboarding.setupBusiness || !onboarding.preferredServices;

  return (
    <DashboardProvider siteId={site?.id ?? null}>
      <SessionRefresher />
      <OnboardingModal
        user={user}
        currentSite={site ?? undefined}
        defaultOpen={showOnboardingModal}
      />
      <div>
        <Header />
        <div className="relative pt-10">
          <Nav
            siteId={site?.id ?? null}
            roleId={user.roleId || "anonymous"}
            hasFeatures={activeFeatures.length != 0}
          />
          <div className="flex min-h-screen w-full flex-col items-center sm:pl-60 bg-stone-50">
            <div className="flex w-full max-w-screen-xl flex-col items-center p-4 sm:p-10 sm:pt-8 space-y-4">
              {!onboarding.isDismissed && !showOnboardingModal && (
                <OnboardingChecklist />
              )}
              {user?.stripeAccountDisabled && user?.stripeAccountId && (
                <StripeDisabledBanner />
              )}
              <div className="relative w-full flex flex-col gap-8">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}
