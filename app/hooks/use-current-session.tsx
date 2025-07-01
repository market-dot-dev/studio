import { SessionUser } from "@/lib/session-helper";
import { useSession as naUseSession } from "next-auth/react";
import { OrganizationRole } from "../generated/prisma";

const useCurrentSession = () => {
  const { data, status, update } = naUseSession();
  const currentUser = data?.user as SessionUser;

  const isSignedIn = () => status === "authenticated";
  const isAdmin = () =>
    (isSignedIn() && currentUser?.currentUserRole === OrganizationRole.ADMIN) ||
    currentUser?.currentUserRole === OrganizationRole.OWNER;

  const refreshSession = async () => {
    console.log("Refreshing session...");
    await update({ force: true });
  };

  return { currentUser, refreshSession, isSignedIn, isAdmin } as const;
};

export default useCurrentSession;
