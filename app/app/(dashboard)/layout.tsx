import { ReactNode, Suspense } from "react";
import { getSession } from "@/lib/auth";
import Profile from "@/components/profile";
import Nav from "@/components/nav";
import { redirect } from "next/navigation";
import { getOnlySiteFromUserId } from "@/lib/actions";
import { Flex } from "@tremor/react";
import OnboardingGuide from "@/components/onboarding/onboarding-guide";
import { DasboardProvider } from "@/components/dashboard/dashboard-context";


export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }
  const site = await getOnlySiteFromUserId(session.user.id);

  return (
    <DasboardProvider siteId={site?.id ?? null}>
      <div>
        <Nav siteId={site?.id ?? null} roleId={session.user?.roleId || 'anonymous'}>
          <Suspense fallback={<div>Loading...</div>}>
            <Profile />
          </Suspense>
        </Nav>
        <div className="min-h-screen dark:bg-black sm:pl-60">
          <Flex alignItems="stretch" className="w-full">

            <div className="w-full grow">
            <OnboardingGuide/>

              {children}
            </div>            
          </Flex>
        </div>
      </div>
    </DasboardProvider>
  );
}
