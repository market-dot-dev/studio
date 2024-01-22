import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { findUser } from "../services/UserService";

const useUser = (id?: string) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    if(id) {
      findUser(id).catch(console.error).then((user) => user && setUser(user))
    }
  }, [id]);

  return [user] as const;
}

export default useUser;