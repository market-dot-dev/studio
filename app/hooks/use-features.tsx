import { findByTierId } from "@/app/services/feature-service";
import { Feature } from "@prisma/client";
import { useEffect, useState } from "react";

const useFeatures = (tierId: string) => {
  const [features, setFeatures] = useState<Feature[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    findByTierId(tierId)
      .then((features) => {
        if (features) {
          setFeatures(features);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [tierId]);

  return [features, isLoading] as const;
};

export default useFeatures;
