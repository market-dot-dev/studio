import { requireUserSession } from "@/app/services/user-context-service";
import UserDropdown from "@/components/header/user-dropdown";
import Logo from "@/components/common/logo";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

export async function Header() {
  const user = await requireUserSession();

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-[var(--header-height)] items-center justify-between bg-black px-4 shadow-border-b">
      <Link href="/">
        <Logo color="white" className="h-[24px] w-auto" />
      </Link>
      <div className="flex items-center gap-3">
        <UserDropdown user={user} />
        <SidebarTrigger className="-mx-2.5 md:hidden" />
      </div>
    </header>
  );
}
