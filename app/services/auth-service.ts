"use server";

import { OrganizationRole, OrganizationType, PlanType, User } from "@/app/generated/prisma";
import { businessDescription } from "@/lib/constants/site-template";
import prisma from "@/lib/prisma";
import { SessionUser, createSessionUser } from "@/types/session";
import { Account, User as NaUser } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import { cookies, type UnsafeUnwrappedCookies } from "next/headers";
import { sendWelcomeEmailToCustomer, sendWelcomeEmailToMaintainer } from "./email-service";
import { createSite } from "./site/site-crud-service";
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
    let currentOrgType: OrganizationType | undefined = undefined;
    let currentUserRole: OrganizationRole | undefined = undefined;

    if (userData.currentOrganizationId) {
      const orgMembership = await prisma.organizationMember.findUnique({
        where: {
          organizationId_userId: {
            organizationId: userData.currentOrganizationId,
            userId: userData.id
          }
        },
        include: {
          organization: {
            select: { type: true }
          }
        }
      });

      if (orgMembership) {
        currentOrgType = orgMembership.organization.type;
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

    newToken.user = createSessionUser(userData, currentOrgType, currentUserRole);
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
  // Get context from cookie
  const signupContext =
    (cookies() as unknown as UnsafeUnwrappedCookies).get("signup_context") ?? null;
  const context = (signupContext?.value ?? null) as string | null;

  // Determine organization type based on context
  const organizationType =
    context === "checkout" ? OrganizationType.CUSTOMER : OrganizationType.VENDOR;

  if (account && user) {
    await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: account.provider,
          providerAccountId: account.providerAccountId
        }
      },
      // this create might not even be required, assuming that the nextauth has already created the account, but just in case
      create: {
        userId: user.id,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        type: "oauth",

        // just ensuring that the account object has the following values
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

  // Create organization for the new user
  const organization = await prisma.organization.create({
    data: {
      name: `${user.name || user.email || "User"}'s Organization`,
      type: organizationType,
      ownerId: user.id,
      description: businessDescription,
      stripeCustomerIds: {},
      stripePaymentMethodIds: {},
      members: {
        create: {
          userId: user.id,
          role: "OWNER"
        }
      },
      // Create billing record with FREE plan by default
      billing: {
        create: {
          planType: PlanType.FREE
        }
      }
    }
  });

  // Update the user with organization reference
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      currentOrganizationId: organization.id
    }
  });

  // Create a site for vendor organizations
  if (organizationType === OrganizationType.VENDOR) {
    await createSite(organization.id);
  }

  // Send welcome emails based on organization type
  if (organizationType === OrganizationType.VENDOR) {
    await sendWelcomeEmailToMaintainer({ ...updatedUser });
  } else {
    await sendWelcomeEmailToCustomer({ ...updatedUser });
  }

  // Clean up context cookie
  if (signupContext) {
    (cookies() as unknown as UnsafeUnwrappedCookies).delete("signup_context");
  }

  return updatedUser;
}
