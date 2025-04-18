"use client";

import { useEffect, useState } from "react";

// Server-side constant for direct imports in server components
export const LOCAL_AUTH_AVAILABLE =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "development" ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

// Client-side hook for use in client components
export function useLocalAuthAvailable() {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    // Check environment on the client side
    const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;
    setIsAvailable(vercelEnv === "development" || vercelEnv === "preview");
  }, []);

  return isAvailable;
}
