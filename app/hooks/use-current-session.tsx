import { getSession } from "@/lib/auth";
import { useSession as naUseSession } from "next-auth/react";
import { SessionUser } from "../models/Session";
import { useEffect, useState } from "react";

const useCurrentSession = () => {
  const [currentUser, setCurrentUser] = useState<SessionUser | undefined>();
  const { status, update } = naUseSession();

  useEffect(() => {
    getSession().then((session) => setCurrentUser(session?.user));
  }, [status]);
  
  const isSignedIn = () => status === "authenticated";

  const refreshSession = async () => {
    await update();
    const session = await getSession();
    setCurrentUser(session?.user);
  }

  return { getSession, currentUser, refreshSession: update, isSignedIn } as const;
}

export default useCurrentSession;
