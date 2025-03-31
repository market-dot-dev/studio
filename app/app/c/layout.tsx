import { ReactNode } from "react";
import CustomerNav from "@/components/customer-nav";
import Header from "@/components/header/header";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    return (
      <div>
        <Header />
        <div className="relative pt-10">
          <CustomerNav />
          <div className="min-h-screen bg-stone-100 dark:bg-black sm:pl-[var(--navWidth)]">
            <div className="flex w-full items-stretch">
              <div className="w-full grow">{children}</div>
            </div>
          </div>
        </div>
      </div>
    );
}