"use client";

import { type PackageCardData } from "@/components/onboarding/package-card";
import { useCallback, useEffect, useState } from "react";

function getLocalStorageKey(organizationId: string): string {
  return `${organizationId}-draft-packages`;
}

export function useDraftPackages(organizationId: string) {
  const [draftPackages, setDraftPackages] = useState<PackageCardData[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const localStorageKey = getLocalStorageKey(organizationId);

  useEffect(() => {
    try {
      const storedPackages = localStorage.getItem(localStorageKey);
      if (storedPackages) {
        setDraftPackages(JSON.parse(storedPackages));
      }
    } catch (error) {
      console.error("Failed to parse stored packages", error);
      localStorage.removeItem(localStorageKey);
    }
    setIsLoaded(true);
  }, [localStorageKey]);

  const storeDraftPackages = useCallback(
    (packages: PackageCardData[]) => {
      setDraftPackages(packages);
      localStorage.setItem(localStorageKey, JSON.stringify(packages));
    },
    [localStorageKey]
  );

  const clearDraftPackages = useCallback(() => {
    setDraftPackages([]);
    localStorage.removeItem(localStorageKey);
  }, [localStorageKey]);

  return {
    draftPackages,
    isLoaded,
    storeDraftPackages,
    clearDraftPackages
  };
}
