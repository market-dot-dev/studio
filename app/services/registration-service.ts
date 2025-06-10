"use server";

import { User } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { cookies, type UnsafeUnwrappedCookies } from "next/headers";
import { userExists } from "./auth-service";

interface UserDetails {
  id: User["id"];
  name: User["name"];
  email: User["email"];
  image: User["image"];
}

/**
 * Upsert a user with the provided details
 * Creates a new user if one doesn't exist, otherwise updates existing user with non-empty values
 */
export async function upsertUser(userDetails: UserDetails) {
  const { id, name, email, image } = userDetails;

  // Check if a user exists with the given GitHub username
  const existingUser = email
    ? await prisma.user.findUnique({
        where: { email }
      })
    : null;

  if (existingUser) {
    // If the user exists, conditionally update their information
    const user = await prisma.user.update({
      where: { id: existingUser.id }, // Use the unique identifier for updates
      data: {
        // Update only if the existing record has these fields blank
        name: existingUser.name ? existingUser.name : name,
        email: existingUser.email ? existingUser.email : email,
        image: existingUser.image ? existingUser.image : image,
        updatedAt: new Date() // Update the 'updatedAt' field to the current time
      }
    });

    return user;
  } else {
    // If the user doesn't exist, create a new one with the provided details
    const user = await prisma.user.create({
      data: {
        id, // This should be a unique identifier, ensure you generate or provide this
        name,
        email,
        image,
        emailVerified: null, // Set this to the current time if the email is verified at creation
        createdAt: new Date(), // Set to the current time
        updatedAt: new Date() // Set to the current time
      }
    });

    return user;
  }
}

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
