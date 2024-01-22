import { useEffect, useState } from "react";
import { findTier } from "../services/TierService";
import Tier from "../models/Tier";

const useTier = (id: string) => {
  const [tier, setTier] = useState<Tier>();

  useEffect(() => {
    findTier(id).catch(console.error).then((tier) => tier && setTier(tier))
  }, [id]);

  return [tier] as const;
}

export default useTier;