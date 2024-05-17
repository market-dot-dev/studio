"use client";

import { SessionProvider } from "next-auth/react";
import { SessionProvider as UserSessionProvider } from './hooks/session-context';
import { Toaster } from "sonner";
import { ModalProvider } from "@/components/modal/provider";
import { Theme } from '@radix-ui/themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Theme>
      <SessionProvider>
        <UserSessionProvider>
          <Toaster className="dark:hidden" />
          <Toaster theme="dark" className="hidden dark:block" />
          <ModalProvider>{children}</ModalProvider>
        </UserSessionProvider>
      </SessionProvider>
    </Theme>
  );
}
