import { userIsMarketExpert } from "@/app/services/market-service";
import {
  defaultOnboardingState,
  OnboardingState
} from "@/app/services/onboarding/onboarding-steps";
import { getSiteByOrgId } from "@/app/services/site/site-crud-service";
import { requireOrganization, requireUser } from "@/app/services/user-context-service";
import SessionRefresher from "@/components/common/session-refresher";
import { StripeDisabledBanner } from "@/components/common/stripe-disabled-banner";
import { DashboardProvider } from "@/components/dashboard/dashboard-context";
import { Header } from "@/components/header/header";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import OnboardingModal from "@/components/onboarding/onboarding-modal";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default async function DashboardLayout(props: { children: ReactNode }) {
  const { children } = props;

  const user = await requireUser();
  const org = await requireOrganization();
  const isMarketExpert = await userIsMarketExpert();

  const onboarding = user.onboarding
    ? (JSON.parse(user.onboarding) as OnboardingState)
    : defaultOnboardingState;
  const site = await getSiteByOrgId(org.id);

  return (
    <DashboardProvider siteId={site?.id ?? null} initialExpertStatus={isMarketExpert}>
      <SessionRefresher />
      <OnboardingModal user={user} currentSite={site ?? undefined} onboardingState={onboarding} />
      <SidebarProvider>
        <Header />
        <DashboardSidebar user={user} isMarketExpert={isMarketExpert} site={site} />
        <main className="flex min-h-screen w-screen flex-col items-center bg-stone-100 pt-10 md:w-[calc(100vw-var(--sidebar-width))]">
          {user.stripeAccountDisabled && <StripeDisabledBanner />}
          <div className="flex w-full max-w-screen-xl flex-col gap-y-8 p-6 sm:p-10 sm:pt-8">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </DashboardProvider>
  );
}
