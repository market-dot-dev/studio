import { shouldShowOnboarding } from "@/app/services/onboarding/onboarding-service";
import { OnboardingNavigation } from "@/components/onboarding/onboarding-navigation";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const needsOnboarding = await shouldShowOnboarding();
  if (!needsOnboarding) {
    redirect("/");
  }

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
