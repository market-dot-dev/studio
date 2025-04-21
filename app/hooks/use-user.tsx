import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { findUser } from "../services/UserService";

const useUser = (id?: string) => {
  const [user, setUser] = useState<User | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      findUser(id)
        .then((user) => {
          if (user) {
            setUser(user);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [id]);

  return [user, isLoading] as const;
};

export default useUser;
