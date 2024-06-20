import { Flex } from "@tremor/react";
import { ReactNode } from "react";

export default async function NoNavLayout({ children }: { children: ReactNode }) {
    return (
        <div>
        <div className="min-h-screen dark:bg-black sm:pl-60">
          <Flex alignItems="stretch" className="w-full">
            <div className="w-full grow">
              {children}
            </div>
          </Flex>
        </div>
      </div>
    );
};