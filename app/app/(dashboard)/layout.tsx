import { organizationIsMarketExpert } from "@/app/services/market-service";
import {
  getOnboardingData,
  shouldShowOnboarding
} from "@/app/services/onboarding/onboarding-service";
import { getFirstIncompleteStep } from "@/app/services/onboarding/onboarding-steps";
import { getSiteByOrgId } from "@/app/services/site/site-crud-service";
import {
  getOrganizationSwitcherContext,
  requireOrganization
} from "@/app/services/user-context-service";
import { NoStripeBanner } from "@/components/common/no-stripe-banner";
import SessionRefresher from "@/components/common/session-refresher";
import { DashboardProvider } from "@/components/dashboard/dashboard-context";
import { Header } from "@/components/header/header";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function DashboardLayout(props: { children: ReactNode }) {
  const { children } = props;

  const needsOnboarding = await shouldShowOnboarding();

  if (needsOnboarding) {
    const { onboarding } = await getOnboardingData();
    const nextStep = getFirstIncompleteStep(onboarding);
    if (nextStep) {
      redirect(nextStep.path);
    }
  }

  const org = await requireOrganization();
  const orgContext = await getOrganizationSwitcherContext();
  const isMarketExpert = await organizationIsMarketExpert();
  const site = await getSiteByOrgId(org.id);

  return (
    <DashboardProvider siteId={site?.id ?? null} initialExpertStatus={isMarketExpert}>
      <SessionRefresher />
      <SidebarProvider>
        <Header />
        <DashboardSidebar orgContext={orgContext} isMarketExpert={isMarketExpert} site={site} />
        <main className="flex min-h-screen w-screen flex-col items-center bg-stone-100 pt-10 md:w-[calc(100vw-var(--sidebar-width))]">
          <NoStripeBanner />
          <div className="flex w-full max-w-screen-xl flex-col gap-y-8 p-6 sm:p-10 sm:pt-8">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </DashboardProvider>
  );
}
