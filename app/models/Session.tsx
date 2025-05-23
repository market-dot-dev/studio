import { User } from "@/app/generated/prisma";

export type SessionUser = {
  id: string;
  name?: string;
  username?: string;
  gh_id?: number;
  email?: string;
  image?: string;
  onboarding?: string;
  currentOrgId?: string;
  // @TODO: Pending migration to Organization
  roleId: string;
};

export type Session = {
  user: SessionUser;
  expires: string;
} | null;

export const createSessionUser = (user: User): SessionUser => {
  return {
    id: user.id,
    name: user.name || undefined,
    username: user.username || user.gh_username || undefined,
    gh_id: user.gh_id || undefined,
    email: user.email || undefined,
    onboarding: user.onboarding || undefined,
    image: user.image || undefined,
    currentOrgId: user.currentOrganizationId || undefined,

    // @TODO: Pending migration to Organization
    roleId: user.roleId || "anonymous"
  };
};

export default Session;
