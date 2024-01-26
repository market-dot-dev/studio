import { Flex } from "@tremor/react";
import { ReactNode, Suspense } from "react";
import Profile from "@/components/profile";
import CustomerNav from "@/components/customer-nav";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div>
        <CustomerNav>
          <Suspense fallback={<div>Loading...</div>}>
            <Profile />
          </Suspense>
        </CustomerNav>
        <div className="min-h-screen dark:bg-black sm:pl-60">
          <Flex alignItems="stretch" className="w-full">
            <div className="w-full grow">
              {children}
            </div>
          </Flex>
        </div>
      </div>
    );
}