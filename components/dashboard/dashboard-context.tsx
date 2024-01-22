'use client'
import { createContext, useContext, ReactNode } from "react";

export const DashboardContext = createContext<string | null>(null);

export function DasboardProvider({ children, siteId }: { children: ReactNode; siteId: string | null }) {
  return <DashboardContext.Provider value={siteId}>{children}</DashboardContext.Provider>;
}

export function useSiteId() {
  const siteId = useContext(DashboardContext);
  if (siteId === null) {
    throw new Error("useSiteId must be used within a DashboardProvider");
  }
  return siteId;
}
