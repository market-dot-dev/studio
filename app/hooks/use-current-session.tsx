import { useSession as naUseSession } from "next-auth/react";
import { OrganizationRole } from "../generated/prisma";
import { SessionUser } from "../models/Session";

const useCurrentSession = () => {
  const { data, status, update } = naUseSession();
  const currentUser = data?.user as SessionUser;

  const isSignedIn = () => status === "authenticated";
  const isAdmin = () => isSignedIn() && currentUser?.currentUserRole === OrganizationRole.ADMIN;

  const refreshSession = async () => {
    console.log("Refreshing session...");
    await update({ force: true });
  };

  return { currentUser, refreshSession, isSignedIn, isAdmin } as const;
};

export default useCurrentSession;
