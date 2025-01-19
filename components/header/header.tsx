import Nav from "@/components/nav";
import Link from "next/link";
import Logo from "@/components/home/logo";
import UserDropwdown from "@/components/header/user-dropwdown";
import FeatureService from "@/app/services/feature-service";
import { getOnlySiteFromUserId } from "@/app/services/SiteService";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Header() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const site = await getOnlySiteFromUserId(user.id);
  const activeFeatures = await FeatureService.findActiveByCurrentUser();

  return (
    <header className="fixed inset-x-0 top-0 z-[31] flex h-[var(--headerHeight)] items-center justify-between bg-black px-4 shadow-border-b">
      <Link href="/">
        <Logo color="white" className="h-[22px] w-auto" />
      </Link>
      <div className="flex items-center gap-4">
        <UserDropwdown user={user} />
        <Nav
          siteId={site?.id ?? null}
          roleId={user.roleId || "anonymous"}
          hasFeatures={activeFeatures.length != 0}
          isMobile={true}
        />
      </div>
    </header>
  );
}
