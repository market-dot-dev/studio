import { Flex } from "@tremor/react";
import { ReactNode, Suspense } from "react";
import CustomerNav from "@/components/customer-nav";
import Header from "@/components/header/header";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    return (
      <div>
        <Header />
        <div className="relative pt-10">
          <CustomerNav />
          <div className="min-h-screen dark:bg-black sm:pl-60">
            <Flex alignItems="stretch" className="w-full">
              <div className="w-full grow">
                {children}
              </div>
            </Flex>
          </div>
        </div>
      </div>
    );
}