import { OrganizationRole, OrganizationType, User } from "@/app/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export type SessionUser = {
  id: string;
  name?: string;
  username?: string;
  email?: string;
  image?: string;
  // New organization context
  currentOrgId?: string;
  currentOrgType?: OrganizationType;
  currentUserRole?: OrganizationRole;
};

export type Session = {
  user: SessionUser;
  expires: string;
} | null;

export const createSessionUser = (
  user: User,
  currentOrgType?: OrganizationType,
  currentUserRole?: OrganizationRole
): SessionUser => {
  return {
    id: user.id,
    name: user.name || undefined,
    username: user.username || undefined,
    email: user.email || undefined,
    image: user.image || undefined,
    currentOrgId: user.currentOrganizationId || undefined,
    currentOrgType: currentOrgType,
    currentUserRole: currentUserRole
  };
};

export async function getSession(): Promise<Session | null> {
  return getServerSession(authOptions) as Promise<Session | null>;
}
