import { Header } from "@/components/header/header";
import { CustomerSidebar } from "@/components/navigation/customer-sidebar";
import { ReactNode } from "react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      <div className="relative pt-10">
        <CustomerSidebar />
        <div className="min-h-screen bg-stone-100 dark:bg-black sm:pl-[var(--sidebar-width)]">
          <div className="flex w-full items-stretch">
            <div className="w-full grow">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
