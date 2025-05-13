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
import { Header } from "@/components/header/header";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import OnboardingModal from "@/components/onboarding/onboarding-modal";
import { SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function DashboardLayout(props: { children: ReactNode }) {
  const { children } = props;

  const user = await UserService.getCurrentUser();
  if (!user?.id) {
    redirect("/login");
  }

  const isMarketExpert = await userIsMarketExpert();
  const onboarding = user.onboarding
    ? (JSON.parse(user.onboarding) as OnboardingState)
    : defaultOnboardingState;
  const site = await getOnlySiteFromUserId(user.id);

  return (
    <SidebarProvider>
      <Header />
      <DashboardSidebar user={user} isMarketExpert={isMarketExpert} site={site} />
      <DashboardProvider siteId={site?.id ?? null} initialExpertStatus={isMarketExpert}>
        <SessionRefresher />
        <OnboardingModal user={user} currentSite={site ?? undefined} onboardingState={onboarding} />
        <div className="w-full pt-10">
          <main className="flex min-h-screen w-full flex-col items-center bg-stone-100 ">
            {user?.stripeAccountDisabled && <StripeDisabledBanner />}
            <div className="flex w-full max-w-screen-xl flex-col items-center space-y-4 p-6 sm:p-10 sm:pt-8">
              <div className="relative flex w-full flex-col gap-8">{children}</div>
            </div>
          </main>
        </div>
      </DashboardProvider>
    </SidebarProvider>
  );
}
