import { Header } from "@/components/header/header";
import { CustomerNav } from "@/components/navigation/customer-nav";
import { ReactNode } from "react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      <div className="relative pt-10">
        <CustomerNav />
        <div className="min-h-screen bg-stone-100 dark:bg-black sm:pl-[var(--sidebar-width)]">
          <div className="flex w-full items-stretch">
            <div className="w-full grow">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
