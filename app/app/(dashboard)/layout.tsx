import { ReactNode, Suspense } from "react";
import Profile from "@/components/profile";
import Nav from "@/components/nav";
import { redirect } from "next/navigation";
import { getOnlySiteFromUserId } from "@/app/services/SiteService";
import { Flex } from "@tremor/react";
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
        <Nav
          siteId={site?.id ?? null}
          roleId={user.roleId || "anonymous"}
          hasFeatures={activeFeatures.length != 0}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <Profile />
          </Suspense>
        </Nav>
        <div className="flex min-h-screen w-full flex-col items-center sm:pl-60">
          <div className="flex w-full flex-col items-center gap-4 p-4">
            {!onboarding.isDismissed && !showOnboardingModal && (
              <OnboardingChecklist />
            )}
            {user?.stripeAccountDisabled && user?.stripeAccountId && (
              <StripeDisabledBanner />
            )}
            <div className="relative mx-auto flex w-full max-w-screen-xl grow flex-col gap-8 p-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}
