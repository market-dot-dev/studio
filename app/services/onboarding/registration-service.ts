"use server";

import { User } from "@/app/generated/prisma";
import { cookies, type UnsafeUnwrappedCookies } from "next/headers";
import { userExists } from "../auth-service";

/**
 * Set up a user sign up by storing the name in cookies and checking if user already exists
 */
export async function setSignUp(userAttributes: Partial<User>) {
  if (!userAttributes.email) {
    throw new Error("Email is required");
  }

  if (!userAttributes.name) {
    throw new Error("Name is required");
  }

  // Check if the user exists
  const exists = await userExists(userAttributes.email);

  if (exists) {
    return false;
  }

  (cookies() as unknown as UnsafeUnwrappedCookies).set("signup_name", userAttributes.name); //@NOTE: This cookie may be deprecated

  return true;
}
