import { Header } from "@/components/header/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default async function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Header />
      <main className="flex min-h-screen w-screen flex-col items-center bg-stone-100 pt-10">
        <div className="flex w-full flex-col">{children}</div>
      </main>
    </SidebarProvider>
  );
}
