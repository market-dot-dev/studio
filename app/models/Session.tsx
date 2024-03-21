import { User } from "@prisma/client";

export type SessionUser = {
  id: string;
  name?: string;
  username?: string;
  email?: string;
  image?: string;
  onboarding?: string;
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
    email: user.email || undefined,
    roleId: user.roleId || 'anonymous',
    onboarding: user.onboarding || undefined,
    image: user.image || undefined,
    stripeCustomerIds: (user.stripeCustomerIds || {}) as Record<string, string>,
    stripePaymentMethodIds: (user.stripePaymentMethodIds || {}) as Record<string, string>,
    stripeAccountId: user.stripeAccountId || undefined,
    stripeAccountDisabled: user.stripeAccountDisabled || false,
  }
}

export default Session;