import { useSession as naUseSession } from "next-auth/react";
import { SessionUser } from "../models/Session";

const useCurrentSession = () => {
  const { data, status, update } = naUseSession();
  const currentUser = data?.user as SessionUser;
  
  const isSignedIn = () => status === "authenticated";

  const refreshSession = async () => {
    await update();
  }

  return { currentUser, refreshSession: update, isSignedIn } as const;
}

export default useCurrentSession;
