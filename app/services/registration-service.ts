"use server";

import { User } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { cookies, type UnsafeUnwrappedCookies } from "next/headers";
import { userExists } from "./auth-service";

interface UserDetails {
  id: string;
  gh_id?: number;
  gh_username: string;
  name: string;
  email: string;
  image: string;
  roleId: string;
}

class RegistrationService {
  static async upsertUser(userDetails: UserDetails) {
    const { id, gh_username, gh_id, name, email, image } = userDetails;

    // Check if a user exists with the given GitHub username
    const existingUser = await prisma.user.findUnique({
      where: { gh_username } // Assuming gh_username is unique
    });

    if (existingUser) {
      // If the user exists, conditionally update their information
      const user = await prisma.user.update({
        where: { id: existingUser.id }, // Use the unique identifier for updates
        data: {
          // Update only if the existing record has these fields blank
          name: existingUser.name ? existingUser.name : name,
          email: existingUser.email ? existingUser.email : email,
          image: existingUser.image ? existingUser.image : image,
          gh_id: existingUser.gh_id ? existingUser.gh_id : gh_id,
          username: existingUser.username ? existingUser.username : gh_username,
          updatedAt: new Date() // Update the 'updatedAt' field to the current time
        }
      });

      return user;
    } else {
      // If the user doesn't exist, create a new one with the provided details
      const user = await prisma.user.create({
        data: {
          id, // This should be a unique identifier, ensure you generate or provide this
          gh_username,
          gh_id,
          name,
          email,
          image,
          username: gh_username,
          roleId: "customer", // @DEPRECATED
          emailVerified: null, // Set this to the current time if the email is verified at creation
          createdAt: new Date(), // Set to the current time
          updatedAt: new Date() // Set to the current time
        }
      });

      return user;
    }
  }

  static async setSignUp(userAttributes: Partial<User>) {
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

    (cookies() as unknown as UnsafeUnwrappedCookies).set("signup_name", userAttributes.name);

    return true;
  }
}

export default RegistrationService;
export const { setSignUp } = RegistrationService;
