import Link from "next/link";
import Logo from "../home/logo";
import UserDropwdown from "./user-dropwdown";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Nav() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <header className="fixed top-0 inset-x-0 flex items-center justify-between bg-black px-4 h-10 shadow-border-b z-[31]">
      <Link href="/">
        <Logo color="white" className="h-[22px] w-fit" />
      </Link>
      <UserDropwdown user={session.user} />
    </header>
  );
}
