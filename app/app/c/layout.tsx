import CustomerNav from "@/components/customer-nav";
import Header from "@/components/header/header";
import { ReactNode } from "react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      <div className="relative pt-10">
        <CustomerNav />
        <div className="min-h-screen bg-stone-100 sm:pl-[var(--navWidth)] dark:bg-black">
          <div className="flex w-full items-stretch">
            <div className="w-full grow">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
