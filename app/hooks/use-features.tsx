import { useEffect, useState } from "react";
import { findByTierId } from "@/app/services/feature-service";
import { Feature } from "@prisma/client";

const useFeatures = (tierId: string) => {
  const [features, setFeatures] = useState<Feature[]>();

  useEffect(() => {
    findByTierId(tierId).catch(console.error).then((features) => features && setFeatures(features))
  }, [tierId]);

  return [features] as const;
}

export default useFeatures;