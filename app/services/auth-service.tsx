"use server";

import prisma from "@/lib/prisma";
import { defaultOnboardingState } from "./onboarding/onboarding-steps";
import { cookies } from "next/headers";
import { projectDescription, projectName } from "@/lib/constants/site-template";
import { createSessionUser } from "../models/Session";
import UserService from "./UserService";
import EmailService from "./EmailService";
import { JWT } from "next-auth/jwt";
import { Account, User as NaUser } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { User } from "@prisma/client";

type JwtCallbackParams = {
  token: JWT;
  user: AdapterUser | NaUser;
  account: Account | null;
  //profile?: Profile | undefined;
  trigger?: "signIn" | "update" | "signUp" | undefined;
  isNewUser?: boolean | undefined;
  session?: any;
}

/*
const isAdmin = currentUser?.roleId === "admin";
if (session?.roleId && isAdmin) {
  token.user = {
    foo: "bar",
    ...token.user,
    roleId: session.roleId,
  };
} else {
*/

class AuthService {
  static async jwtCallback({
    token,
    user,
    account,
    trigger,
    session,
    isNewUser,
  }: JwtCallbackParams) {
    let newToken = { ...token };

    let userData: User | undefined | null = undefined;

    if (trigger === "update") {
      if(token.id){
        console.log('--------------- update');
        userData = await UserService.findUser(user.id);
      }
    } else if (trigger === "signIn") {
      console.log('--------------- signIn');
      userData = await this.onSignIn(user);
    } else if (trigger === "signUp") {
      console.log('--------------- signUp');
      userData = await this.onCreateUser(account, user);
    } else {
      console.log('----------------- default');
    }

    newToken.user = userData ? createSessionUser(userData) : token.user;

    return newToken;
  }

  static async sessionCallback({ session, token }: any) {
    console.log('----------------- sessionCallback');
    session.user = token.user;
    return session;
  }

  static async onSignIn(naUser: NaUser){
    const user = await UserService.findUser(naUser.id);

    if(!user){
      return null;
    }

    // at this point, the user item in table does not have the onboarding data set. So, we can attach the default one to the first token being generated on signup.
    if (!user.onboarding) {
      user.onboarding = JSON.stringify(defaultOnboardingState);
    }

    return user;
  }

  static async onCreateUser(account: any, user: NaUser) {
    const signupName = cookies().get("signup_name") ?? null;
    const name = (signupName?.value ?? null) as string | null;

    const roleId = account.provider === "github" ? "maintainer" : "customer";

    if (account && user) {
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

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        roleId,
        projectName,
        projectDescription,
        ...(name ? { name } : {}),
      },
    });

    if (updatedUser.roleId === "maintainer") {
      await EmailService.sendNewMaintainerSignUpEmail({ ...updatedUser });
    } else {
      await EmailService.sendNewCustomerSignUpEmail({ ...updatedUser });
    }

    if (signupName) {
      cookies().delete("signup_name");
    }

    return updatedUser;
  }
}

export default AuthService;
