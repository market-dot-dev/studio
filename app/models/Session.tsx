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
  company?: string;
  roleId: string;
  stripeCustomerIds: Record<string, string>;
  stripePaymentMethodIds: Record<string, string>;
  stripeAccountId?: string;
  stripeAccountDisabled?: boolean;
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
    company: user.company || undefined,
    roleId: user.roleId || "anonymous",
    stripeCustomerIds: (user.stripeCustomerIds || {}) as Record<string, string>,
    stripePaymentMethodIds: (user.stripePaymentMethodIds || {}) as Record<string, string>,
    stripeAccountId: user.stripeAccountId || undefined,
    stripeAccountDisabled: user.stripeAccountDisabled || false
  };
};

export default Session;
