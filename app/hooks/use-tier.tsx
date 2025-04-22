import { useEffect, useState } from "react";
import Tier from "../models/Tier";
import { findTier } from "../services/tier-service";

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
};

export default useTier;
