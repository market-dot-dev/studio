import { User } from "@prisma/client";

export type SessionUser = {
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  image?: string;
  onboarding?: string;
  roleId: string;
  stripeCustomerIds?: Record<string, string>;
  stripePaymentMethodId?: string;
  stripeProductId?: string;
  stripeAccountId?: string;
  stripeAccountDisabled?: boolean;
};

export type Session = {
  user: SessionUser;
  expires: string;
} | null;

export const createSessionUser = (user: User): SessionUser => {
  return {
    name: user.name || undefined,
    username: user.username || user.gh_username || undefined,
    email: user.email || undefined,
    roleId: user.roleId || 'anonymous',
    onboarding: user.onboarding || undefined,
    image: user.image || undefined,
    stripeCustomerIds: user.stripeCustomerIds || undefined,
    stripePaymentMethodId: user.stripePaymentMethodId || undefined,
    stripeProductId: user.stripeProductId || undefined,
    stripeAccountId: user.stripeAccountId || undefined,
    stripeAccountDisabled: user.stripeAccountDisabled || false,
  }
}

export default Session;