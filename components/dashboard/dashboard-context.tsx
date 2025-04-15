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

const DashboardContext = createContext<DashboardContextType>(defaultContextValue);

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

  // this was previously throwing an error if the context was not found
  if (!context || context.siteId === null) {
    return null;
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
