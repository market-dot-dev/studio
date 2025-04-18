import prisma from "@/lib/prisma";
import { faker } from "@faker-js/faker";
import {
  Account,
  Feature,
  Media,
  Page,
  Session,
  Site,
  Subscription,
  Tier,
  TierVersion,
  User
} from "@prisma/client";

export const createUser = async (overrides?: Partial<User>): Promise<User> => {
  return prisma.user.create({
    data: {
      roleId: "customer",
      stripeAccountDisabled: false,
      ...overrides,
      stripeCustomerIds: {},
      stripePaymentMethodIds: {}
    }
  });
};

export const createTier = async (userId: string, overrides?: Partial<Tier>): Promise<Tier> => {
  return prisma.tier.create({
    data: {
      userId,
      name: faker.word.adjective(),
      price: 10,
      revision: 0,
      ...overrides
    }
  });
};

export const createAccount = async (
  userId: string,
  overrides?: Partial<Account>
): Promise<Account> => {
  return prisma.account.create({
    data: {
      userId,
      type: faker.random.word(),
      provider: faker.random.word(),
      providerAccountId: faker.datatype.uuid(),
      ...overrides
    }
  });
};

export const createSession = async (
  userId: string,
  overrides?: Partial<Session>
): Promise<Session> => {
  return prisma.session.create({
    data: {
      userId,
      sessionToken: faker.datatype.uuid(),
      expires: faker.date.future(),
      ...overrides
    }
  });
};

export const createSite = async (userId: string, overrides?: Partial<Site>): Promise<Site> => {
  return prisma.site.create({
    data: {
      userId,
      ...overrides
    }
  });
};

export const createPage = async (
  siteId: string,
  userId: string,
  overrides?: Partial<Page>
): Promise<Page> => {
  return prisma.page.create({
    data: {
      siteId,
      userId,
      ...overrides
    }
  });
};

export const createTierVersion = async (
  tierId: string,
  overrides?: Partial<TierVersion>
): Promise<TierVersion> => {
  return prisma.tierVersion.create({
    data: {
      tierId,
      revision: faker.datatype.number(),
      price: faker.datatype.number(),
      ...overrides
    }
  });
};

export const createSubscription = async (
  userId: string,
  tierId: string,
  overrides?: Partial<Subscription>
): Promise<Subscription> => {
  return prisma.subscription.create({
    data: {
      userId,
      tierId,
      stripeSubscriptionId: faker.datatype.uuid(),
      ...overrides
    }
  });
};

export const createFeature = async (
  userId: string,
  overrides?: Partial<Feature>
): Promise<Feature> => {
  return prisma.feature.create({
    data: {
      userId,
      isEnabled: false,
      ...overrides
    }
  });
};

export const createMedia = async (siteId: string, overrides?: Partial<Media>): Promise<Media> => {
  return prisma.media.create({
    data: {
      siteId,
      url: faker.internet.url(),
      ...overrides
    }
  });
};
