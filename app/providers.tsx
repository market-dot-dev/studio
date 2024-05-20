"use client";

import { SessionProvider } from "next-auth/react";

import { Toaster } from "sonner";
import { ModalProvider } from "@/components/modal/provider";
import { Theme } from '@radix-ui/themes';
import { ProvisionalSessionProvider } from "./hooks/provisional-session-context";

export function Providers({ children, session }: { children: React.ReactNode, session: any }) {
  console.log('initial session', session)
  return (
    <Theme>
        <SessionProvider session={session}>
          <ProvisionalSessionProvider>
            <Toaster className="dark:hidden" />
            <Toaster theme="dark" className="hidden dark:block" />
            <ModalProvider>{children}</ModalProvider>
          </ProvisionalSessionProvider>
        </SessionProvider>
    </Theme>
  );
}
