import { useEffect, useState } from "react";
import { findTier } from "../services/TierService";
import Tier from "../models/Tier";

const useTier = (id: string) => {
  const [tier, setTier] = useState<Tier>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    findTier(id)
      .then((tier) => {
        if (tier) {
          setTier(tier);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  return [tier, isLoading] as const;
}

export default useTier;
