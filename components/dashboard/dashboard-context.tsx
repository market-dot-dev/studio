"use client";
import { validateMarketExpert as validateMarketExpertServerAction } from "@/app/services/market-service";
import { createContext, ReactNode, useContext, useState } from "react";

interface DashboardContextType {
  siteId: string | null;
  fullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;
  isMarketExpert: boolean | null;
  isLoadingMarketExpert: boolean;
  validateMarketExpert: () => Promise<boolean>;
}

const defaultContextValue: DashboardContextType = {
  siteId: null,
  fullscreen: false,
  setFullscreen: () => {},
  isMarketExpert: null,
  isLoadingMarketExpert: false,
  validateMarketExpert: async () => false
};

const DashboardContext = createContext<DashboardContextType>(defaultContextValue);

export function DashboardProvider({
  children,
  siteId,
  initialExpertStatus = null
}: {
  children: ReactNode;
  siteId: string | null;
  initialExpertStatus?: boolean | null;
}) {
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [isMarketExpert, setIsMarketExpert] = useState<boolean | null>(initialExpertStatus);
  const [isLoadingMarketExpert, setIsLoadingMarketExpert] = useState(false);

  // Validation function that components with "Connect" buttons can use
  const validateMarketExpert = async (): Promise<boolean> => {
    // Don't validate if already a market expert or if already loading
    if (isMarketExpert || isLoadingMarketExpert) return isMarketExpert || false;

    try {
      setIsLoadingMarketExpert(true);
      // Use the server action directly from MarketService
      const success = await validateMarketExpertServerAction();

      if (success) {
        setIsMarketExpert(true);
      }

      return success;
    } catch (error) {
      console.error("Error validating market expert:", error);
      return false;
    } finally {
      setIsLoadingMarketExpert(false);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        siteId,
        fullscreen,
        setFullscreen,
        isMarketExpert,
        isLoadingMarketExpert,
        validateMarketExpert
      }}
    >
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

export function useMarketExpert() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useMarketExpert must be used within a DashboardProvider");
  }
  return {
    isMarketExpert: context.isMarketExpert,
    isLoadingMarketExpert: context.isLoadingMarketExpert,
    validateMarketExpert: context.validateMarketExpert
  };
}
