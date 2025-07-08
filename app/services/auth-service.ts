"use server";

import { OrganizationRole, OrganizationType, User } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { SessionUser, createSessionUser } from "@/types/session";
import { Account, User as NaUser } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import { sendWelcomeEmailToCustomer } from "./email-service";
import { getUserById } from "./user-service";

type JwtCallbackParams = {
  token: JWT;
  user: AdapterUser | NaUser;
  account: Account | null;
  trigger?: "signIn" | "update" | "signUp" | undefined;
  isNewUser?: boolean | undefined;
  session?: any;
};

export async function jwtCallback(callbackParams: JwtCallbackParams) {
  const { token, user, account, trigger, session, isNewUser } = callbackParams;
  const sessionUser = token?.user as SessionUser | undefined | null;

  const newToken = { ...token };
  let userData: User | undefined | null = undefined;

  // Only do DB queries on specific triggers, not every request
  if (trigger === "update") {
    if (sessionUser?.id) {
      userData = await prisma.user.findUnique({
        where: { id: sessionUser.id }
      });
    }
  } else if (trigger === "signIn") {
    userData = await onSignIn(account, user || sessionUser);
  } else if (trigger === "signUp") {
    userData = await onCreateUser(account, user || sessionUser);
  }

  // If we have fresh user data, fetch org context
  if (userData) {
    let currentOrgType: OrganizationType | undefined = undefined; // @DEPRECATED, orgType
    let currentUserRole: OrganizationRole | undefined = undefined;

    if (userData.currentOrganizationId) {
      const orgMembership = await prisma.organizationMember.findUnique({
        where: {
          organizationId_userId: {
            organizationId: userData.currentOrganizationId,
            userId: userData.id
          }
        },
        // @DEPRECATED, orgType
        include: {
          organization: {
            select: { type: true }
          }
        }
      });

      if (orgMembership) {
        currentOrgType = orgMembership.organization.type; // @DEPRECATED, orgType
        currentUserRole = orgMembership.role;
      } else {
        // Organization membership not found - clear the currentOrganizationId
        await prisma.user.update({
          where: { id: userData.id },
          data: { currentOrganizationId: null }
        });
        userData.currentOrganizationId = null;
      }
    }

    newToken.user = createSessionUser(userData, currentOrgType, currentUserRole); // @DEPRECATED, orgType
  } else {
    // No fresh user data, keep existing token user data
    newToken.user = token.user;
  }

  return newToken;
}

export async function sessionCallback({ session, token }: any) {
  session.user = token.user;
  return session;
}

async function onSignIn(account: any, naUser: NaUser) {
  const user = await getUserById(naUser.id);

  if (!user) {
    return null;
  }

  const existingAccount = await prisma.account.findFirst({
    where: {
      provider: account.provider,
      providerAccountId: account.providerAccountId
    }
  });

  if (!existingAccount) return user;

  // update refresh/access tokens
  await prisma.account.update({
    where: {
      provider_providerAccountId: {
        provider: account.provider,
        providerAccountId: account.providerAccountId
      }
    },
    data: {
      access_token: account.access_token,
      expires_at: account.expires_at,
      refresh_token: account.refresh_token,
      refresh_token_expires_in: account.refresh_token_expires_in
    }
  });

  return user;
}

async function onCreateUser(account: any, user: NaUser) {
  console.log(`New user signing up: ${user.email}`);

  // The only responsibility of onCreateUser is to ensure the Account record is correct and to perform any initial, user-only setup.
  if (account && user) {
    await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: account.provider,
          providerAccountId: account.providerAccountId
        }
      },
      create: {
        userId: user.id,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        type: "oauth",
        expires_at: account.expires_at,
        refresh_token: account.refresh_token,
        refresh_token_expires_in: account.refresh_token_expires_in
      },
      // the default nextauth implementation does not add the following values to the account object, so updating here
      update: {
        expires_at: account.expires_at,
        refresh_token: account.refresh_token,
        refresh_token_expires_in: account.refresh_token_expires_in
      }
    });
  }

  // Fetch the full user object created by the adapter
  const newUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!newUser) {
    // This should theoretically never happen
    console.error("Could not find newly created user in onCreateUser hook.");
    return null;
  }

  // Send a generic welcome email.
  // We assume every new user is a potential customer until they create a vendor org.
  await sendWelcomeEmailToCustomer({ ...newUser });

  return newUser;
}
