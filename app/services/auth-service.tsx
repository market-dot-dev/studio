"use server";

import prisma from "@/lib/prisma";
import { defaultOnboardingState } from "./onboarding/onboarding-steps";
import { cookies } from "next/headers";
import { projectDescription, projectName } from "@/lib/constants/site-template";
import { createSessionUser } from "../models/Session";
import UserService from "./UserService";
import EmailService from "./EmailService";

class AuthService {
  static async jwtCallback({
    token,
    user,
    account,
    trigger,
    session,
    isNewUser,
  }: any) {
    console.log(`------------ server session refreshed -- trigger: ${trigger}`);
    // update the roleId if switched by the user from the frontend
    if (trigger === "update") {
      const currentUser = await UserService.getCurrentUser();
      const isAdmin = currentUser?.roleId === "admin";

      if (session?.roleId && isAdmin) {
        token.user = {
          foo: "bar",
          ...token.user,
          roleId: session.roleId,
        };
      } else {
        if (currentUser) {
          token.user = {
            ...token.user,
            ...createSessionUser(currentUser),
          };
        }
      }

      return token;
    }

    const userData = user ? { ...user } : null;

    // if its a new user, then based on the provider, we can set the roleId
    if (isNewUser) {
      const signupName = cookies().get("signup_name") ?? null;
      const name = (signupName?.value ?? null) as string | null;

      const roleId = account.provider === "github" ? "maintainer" : "customer";
      await prisma.user.update({
        where: { id: user.id },
        data: {
          roleId,
          projectName,
          projectDescription,
          ...(name ? { name } : {}),
        },
      });
      // also update the roleId in the token
      userData.roleId = roleId;
      if (name) {
        userData.name = name;
      }

      if (userData.roleId === "maintainer") {
        await EmailService.sendNewMaintainerSignUpEmail({ ...userData });
      } else {
        await EmailService.sendNewCustomerSignUpEmail({ ...userData });
      }

      if (signupName) {
        cookies().delete("signup_name");
      }
    }

    // Store the refresh token in the database when the user logs in
    if (account && user) {
      // at this point, the user item in table does not have the onboarding data set. So, we can attach the default one to the first token being generated on signup.
      if (!user.onboarding) {
        userData.onboarding = JSON.stringify(defaultOnboardingState);
      }
      await prisma.account.upsert({
        where: {
          provider_providerAccountId: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
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
          refresh_token_expires_in: account.refresh_token_expires_in,
        },
        // the default nextauth implementation does not add the following values to the account object, so updating here
        update: {
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
          refresh_token_expires_in: account.refresh_token_expires_in,
        },
      });
    }

    if (userData) {
      const sessionUser = createSessionUser(userData);
      token.user = sessionUser;

      /*
      if(token.user?.onboarding?.length) {
        sessionUser.onboarding = true;
      }

      token.user = {
        ...(filteredSession || {}),
        // an empty token.user?.onboarding will signal that the user's onboarding is complete
        ...(token.user?.onboarding?.length ? { onboarding: true } : {}),
      };
      */
    }

    return token;
  }

  static async sessionCallback({ session, token }: any) {
    session.user = token.user;
    return session;
  }
}

export default AuthService;
