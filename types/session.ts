import { OrganizationRole, User } from "@/app/generated/prisma";

export type SessionUser = {
  id: string;
  name?: string;
  username?: string;
  email?: string;
  image?: string;
  // New organization context
  currentOrgId?: string;
  currentUserRole?: OrganizationRole;
};

export type Session = {
  user: SessionUser;
  expires: string;
} | null;

export const createSessionUser = (user: User, currentUserRole?: OrganizationRole): SessionUser => {
  return {
    id: user.id,
    name: user.name || undefined,
    username: user.username || undefined,
    email: user.email || undefined,
    image: user.image || undefined,
    currentOrgId: user.currentOrganizationId || undefined,
    currentUserRole: currentUserRole
  };
};
