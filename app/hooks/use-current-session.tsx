// import { useSession as naUseSession } from "next-auth/react";
import { useSession } from "./provisional-session-context";
// import { SessionUser } from "../models/Session";

const useCurrentSession = () => {
  const { currentUser, refreshSession: update } = useSession();
  
  
  const isSignedIn = () => status === "authenticated";
  const isAdmin = () => isSignedIn() && currentUser?.roleId === "admin";

  const refreshSession = async () => {
    console.log("Refreshing session..."); // Add this line
    await update();
  }

  return { currentUser, refreshSession, isSignedIn, isAdmin } as const;
}

export default useCurrentSession;
