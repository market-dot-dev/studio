import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { findUser } from "../services/UserService";
import { hasActiveFeaturesForUser } from "../services/feature-service";

const useUser = (id?: string) => {
  const [user, setUser] = useState<User>();
  const [hasActiveFeatures, setHasActiveFeatures] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      Promise.all([findUser(id), hasActiveFeaturesForUser(id)])

        .then(([user, hasActiveFeatures]) => {
          if (user) {
            setUser(user);
          }
          setHasActiveFeatures(hasActiveFeatures);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [id]);

  return [user, isLoading, hasActiveFeatures] as const;
};

export default useUser;
