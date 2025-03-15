import { ReactNode } from "react";
import CustomerNav from "@/components/customer-nav";
import Header from "@/components/header/header";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    return (
      <div>
        <Header />
        <div className="relative pt-10">
          <CustomerNav />
          <div className="min-h-screen dark:bg-black bg-stone-100 sm:pl-60">
            <div className="flex items-stretch w-full">
              <div className="w-full grow">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}