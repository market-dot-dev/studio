import { useSession as naUseSession } from "next-auth/react";
import { SessionUser } from "../models/Session";

const useCurrentSession = () => {
  const { data, status, update } = naUseSession();
  const currentUser = data?.user as SessionUser;
  
  const isSignedIn = () => status === "authenticated";
  const notSignedIn = () => status === "unauthenticated";
  const isAdmin = () => isSignedIn() && (currentUser?.roleId === "admin");
  const isCustomer = () => isSignedIn() && (currentUser?.roleId === "customer");

  const refreshSession = async () => {
    console.log("Refreshing session..."); // Add this line
    await update({ force: true });
  }

  return { currentUser, refreshSession, isSignedIn, isAdmin, notSignedIn } as const;
}

export default useCurrentSession;
