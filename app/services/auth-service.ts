"use server";

import { OrganizationRole, OrganizationType, User } from "@/app/generated/prisma";
import { businessDescription, businessName } from "@/lib/constants/site-template";
import prisma from "@/lib/prisma";
import { Account, User as NaUser } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import { cookies, type UnsafeUnwrappedCookies } from "next/headers";
import { SessionUser, createSessionUser } from "../models/Session";
import { sendWelcomeEmailToCustomer, sendWelcomeEmailToMaintainer } from "./email-service";
import { defaultOnboardingState } from "./onboarding/onboarding-steps";
import { createSite } from "./site/site-crud-service";
import { requireUser } from "./user-context-service";
import UserService from "./UserService";

type JwtCallbackParams = {
  token: JWT;
  user: AdapterUser | NaUser;
  account: Account | null;
  trigger?: "signIn" | "update" | "signUp" | undefined;
  isNewUser?: boolean | undefined;
  session?: any;
};

class AuthService {
  static async jwtCallback(callbackParams: JwtCallbackParams) {
    const { token, user, account, trigger, session, isNewUser } = callbackParams;
    const sessionUser = token?.user as SessionUser | undefined | null;

    const newToken = { ...token };
    let userData: User | undefined | null = undefined;

    // Only do DB queries on specific triggers, not every request
    if (trigger === "update") {
      if (sessionUser?.id) {
        userData = await UserService.findUser(sessionUser.id);
      }
    } else if (trigger === "signIn") {
      userData = await AuthService.onSignIn(account, user || sessionUser);
    } else if (trigger === "signUp") {
      userData = await AuthService.onCreateUser(account, user || sessionUser);
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

  static async sessionCallback({ session, token }: any) {
    session.user = token.user;
    return session;
  }

  static async onSignIn(account: any, naUser: NaUser) {
    let user = await UserService.findUser(naUser.id);

    if (!user) {
      return null;
    }

    // backfill the gh_id if it is not present
    if (!user.gh_id && account.provider === "github") {
      const ghId = account.providerAccountId ? parseInt(account.providerAccountId) : null;
      if (ghId) {
        user = await UserService.updateUser(user.id, {
          gh_id: ghId
        });
      }
    }

    // at this point, the user item in table does not have the onboarding data set. So, we can attach the default one to the first token being generated on signup.
    if (!user.onboarding) {
      user.onboarding = JSON.stringify(defaultOnboardingState);
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

  static async onCreateUser(account: any, user: NaUser) {
    //@NOTE: This cookie may be deprecated
    const signupName = (cookies() as unknown as UnsafeUnwrappedCookies).get("signup_name") ?? null;
    const name = (signupName?.value ?? null) as string | null;

    // Determine organization type based on provider
    // GitHub providers and development credentials create VENDOR organizations
    const isDevelopmentUser = user.id.startsWith("dev-");
    const organizationType =
      account.provider === "github" || isDevelopmentUser
        ? OrganizationType.VENDOR
        : OrganizationType.CUSTOMER;

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
        name: name
          ? `${name}'s Organization`
          : `${user.name || user.email || "User"}'s Organization`,
        type: organizationType,
        ownerId: user.id,
        projectName: businessName,
        projectDescription: businessDescription,
        company: name || user.name || null,
        stripeCustomerIds: {},
        stripePaymentMethodIds: {},
        members: {
          create: {
            userId: user.id,
            role: "OWNER"
          }
        }
      }
    });

    // Update the user with organization reference
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        currentOrganizationId: organization.id,
        ...(name ? { name } : {})
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

    //@NOTE: This cookie may be deprecated
    if (signupName) {
      (cookies() as unknown as UnsafeUnwrappedCookies).delete("signup_name");
    }

    return updatedUser;
  }
}

export async function userExists(email: string) {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  return !!user;
}

/**
 * Set an organization as the current one for a user
 */
export async function setCurrentOrganization(organizationId: string): Promise<void> {
  const user = await requireUser();

  // Check if user is a member of the organization
  const membership = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId: user.id
      }
    }
  });

  if (!membership) {
    throw new Error("You are not a member of this organization");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      currentOrganizationId: organizationId
    }
  });
}

export default AuthService;
