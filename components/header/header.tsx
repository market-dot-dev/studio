import Nav from "@/app/components/nav";
import Link from "next/link";
import Logo from "@/components/home/logo";
import UserDropwdown from "@/components/header/user-dropwdown";
import FeatureService from "@/app/services/feature-service";
import { getOnlySiteFromUserId } from "@/app/services/SiteService";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MarketService } from "@/app/services/market-service";
import { defaultOnboardingState } from "@/app/services/onboarding/onboarding-steps";

export default async function Header() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const site = await getOnlySiteFromUserId(user.id);
  const activeFeatures = await FeatureService.findActiveByCurrentUser();
  const isMarketExpert = (await MarketService.getExpert()) != null;
  const onboarding = user.onboarding
    ? JSON.parse(user.onboarding)
    : defaultOnboardingState;
  const showOnboardingModal =
    !onboarding.setupBusiness || !onboarding.preferredServices;

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-[var(--headerHeight)] items-center justify-between bg-black px-4 shadow-border-b">
      <Link href="/">
        <Logo color="white" className="h-[22px] w-auto" />
      </Link>
      <div className="flex items-center gap-4">
        <UserDropwdown user={user} />
        <Nav
          siteId={site?.id ?? null}
          roleId={user.roleId || "anonymous"}
          hasFeatures={activeFeatures.length != 0}
          isMarketExpert={isMarketExpert}
          isMobile={true}
          onboarding={onboarding}
          showOnboardingModal={showOnboardingModal}
        />
      </div>
    </header>
  );
}
