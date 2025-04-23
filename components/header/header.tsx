import Nav from "@/app/components/nav";
import { defaultOnboardingState } from "@/app/services/onboarding/onboarding-steps";
import { getOnlySiteFromUserId } from "@/app/services/SiteService";
import UserDropdown from "@/components/header/user-dropdown";
import Logo from "@/components/home/logo";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Header() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const site = await getOnlySiteFromUserId(user.id);
  const onboarding = user.onboarding ? JSON.parse(user.onboarding) : defaultOnboardingState;
  const showOnboardingModal = !onboarding.setupBusiness || !onboarding.preferredServices;

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-[var(--headerHeight)] items-center justify-between bg-black px-4 shadow-border-b">
      <Link href="/">
        <Logo color="white" className="h-[22px] w-auto" />
      </Link>
      <div className="flex items-center gap-3">
        <UserDropdown user={user} />
        <Nav
          siteId={site?.id ?? null}
          roleId={user.roleId || "anonymous"}
          isMobile={true}
          onboarding={onboarding}
          showOnboardingModal={showOnboardingModal}
        />
      </div>
    </header>
  );
}
