import { getCurrentOrganization } from "@/app/services/user-context-service";
import { OnboardingNavigation } from "@/components/onboarding/onboarding-navigation";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  // Check if we have an organization and if it's onboarded
  const currentOrg = await getCurrentOrganization();

  // If we have an organization, check if it's onboarded
  // We'll import the function locally to avoid circular dependency issues
  if (currentOrg) {
    // Dynamic import to avoid circular dependency
    const { isOrgOnboarded } = await import("@/app/services/onboarding/onboarding-service");
    const isOnboarded = await isOrgOnboarded();
    if (isOnboarded) {
      redirect("/");
    }
  }
  // If no organization, allow access to onboarding

  return (
    <div className="min-h-screen bg-stone-150 px-6 pb-12 pt-6">
      <div className="relative flex w-full flex-col items-center">
        <div className="flex w-full max-w-md items-center justify-center">
          <OnboardingNavigation />

          <Image
            alt="market.dev logo"
            width={36}
            height={36}
            className="size-7 md:size-8"
            src="/gw-logo-nav.png"
            priority
          />
        </div>

        <div className="mt-4 w-full md:mt-6">{children}</div>
      </div>
    </div>
  );
}
