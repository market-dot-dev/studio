'use client'
import { createContext, useContext, useState, ReactNode } from "react";

interface DashboardContextType {
  siteId: string | null;
  fullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;
}

const defaultContextValue: DashboardContextType = {
  siteId: null,
  fullscreen: false,
  setFullscreen: () => {}
};

export const DashboardContext = createContext<DashboardContextType>(defaultContextValue);

export function DashboardProvider({ children, siteId }: { children: ReactNode; siteId: string | null }) {
  const [fullscreen, setFullscreen] = useState<boolean>(false);

  return (
    <DashboardContext.Provider value={{ siteId, fullscreen, setFullscreen }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useSiteId() {
  const context = useContext(DashboardContext);
  if (context.siteId === null) {
    throw new Error("useSiteId must be used within a DashboardProvider");
  }
  return context.siteId;
}

export function useFullscreen() {
  const context = useContext(DashboardContext);
  return {
    fullscreen: context.fullscreen,
    setFullscreen: context.setFullscreen
  };
}
