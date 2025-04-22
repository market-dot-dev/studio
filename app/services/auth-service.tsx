"use server";

import { businessDescription, businessName } from "@/lib/constants/site-template";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import { Account, User as NaUser } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import { cookies, type UnsafeUnwrappedCookies } from "next/headers";
import { SessionUser, createSessionUser } from "../models/Session";
import EmailService from "./EmailService";
import { defaultOnboardingState } from "./onboarding/onboarding-steps";
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

    if (trigger === "update") {
      if (session?.["impersonate"] !== undefined && sessionUser?.roleId === "admin") {
        userData = await UserService.findUser(session.impersonate);
      } else if (sessionUser?.id) {
        userData = await UserService.findUser(sessionUser.id);
      }
    } else if (trigger === "signIn") {
      userData = await AuthService.onSignIn(account, user || sessionUser);
    } else if (trigger === "signUp") {
      userData = await AuthService.onCreateUser(account, user || sessionUser);
    }

    newToken.user = userData ? createSessionUser(userData) : token.user;

    return newToken;
  }

  //{ session: Session; token: JWT }
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

    // FIXME
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
    const signupName = (cookies() as unknown as UnsafeUnwrappedCookies).get("signup_name") ?? null;
    const name = (signupName?.value ?? null) as string | null;

    const roleId = account.provider === "github" ? "maintainer" : "customer";

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

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        roleId,
        projectName: businessName,
        projectDescription: businessDescription,
        ...(name ? { name } : {})
      }
    });

    if (updatedUser.roleId === "maintainer") {
      await EmailService.sendNewMaintainerSignUpEmail({ ...updatedUser });
    } else {
      await EmailService.sendNewCustomerSignUpEmail({ ...updatedUser });
    }

    if (signupName) {
      (cookies() as unknown as UnsafeUnwrappedCookies).delete("signup_name");
    }

    return updatedUser;
  }
}

export default AuthService;
