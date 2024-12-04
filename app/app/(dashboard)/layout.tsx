import { ReactNode, Suspense } from "react";
import Profile from "@/components/profile";
import Nav from "@/components/nav";
import { redirect } from "next/navigation";
import { getOnlySiteFromUserId } from "@/app/services/SiteService";
import { Flex } from "@tremor/react";
import OnboardingChecklist from "@/components/onboarding/onboarding-checklist";
import { DashboardProvider } from "@/components/dashboard/dashboard-context";
import SessionService from "@/app/services/SessionService";
import StripeDisabledBanner from "@/components/common/stripe-disabled-banner";
import SessionRefresher from "@/components/common/session-refresher";
import FeatureService from "@/app/services/feature-service";
import OnboardingForm from "@/components/onboarding/onboarding-form";
import UserService from "@/app/services/UserService";
import Modal from "@/components/common/modal";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await UserService.getCurrentUser();
  const onboarding = user?.onboarding;
  if (!user?.id) {
    redirect("/login");
  }

  const site = await getOnlySiteFromUserId(user.id);
  const activeFeatures = await FeatureService.findActiveByCurrentUser();

  return (
    <DashboardProvider siteId={site?.id ?? null}>
      <SessionRefresher />
      <Modal isOpen={true} showCloseButton={false}>
        <OnboardingForm user={user} />
      </Modal>
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
        <div className="min-h-screen sm:pl-60">
          <Flex alignItems="stretch" className="flex w-full flex-col gap-4 p-4">
            {onboarding && <OnboardingChecklist />}
            {user?.stripeAccountDisabled && user?.stripeAccountId && (
              <StripeDisabledBanner />
            )}
            <div className="relative mx-auto flex w-full max-w-screen-xl grow flex-col gap-8 p-4">
              {children}
            </div>
          </Flex>
        </div>
      </div>
    </DashboardProvider>
  );
}
