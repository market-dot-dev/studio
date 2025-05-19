// app/services/user-context-service.ts
"use server";

import { Organization, User } from "@/app/generated/prisma";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cache } from "react";
import { SessionUser } from "../models/Session";

// Data access functions - return nullable results

export const getCurrentUserSession = cache(async (): Promise<SessionUser | null> => {
  const session = await getSession();
  return session?.user || null;
});

export const requireUserSession = cache(async (): Promise<SessionUser> => {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/api/auth/server-signout/");
  }
  return session.user;
});

// Full user functions (with DB queries)

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const session = await getCurrentUserSession();
  if (!session?.id) return null;

  return prisma.user.findUnique({
    where: { id: session.id }
  });
});

export const requireUser = cache(async (): Promise<User> => {
  const session = await requireUserSession();
  const user = await prisma.user.findUnique({
    where: { id: session.id }
  });

  if (!user) {
    // This should rarely happen - only if user was deleted after session was created
    redirect("/api/auth/server-signout/");
  }

  return user;
});

// Organization functions

export const getCurrentOrganization = cache(async (): Promise<Organization | null> => {
  const user = await getCurrentUser();
  if (!user?.currentOrganizationId) return null;

  return prisma.organization.findUnique({
    where: { id: user.currentOrganizationId }
  });
});

export const requireOrganization = cache(async (): Promise<Organization> => {
  const user = await requireUser(); // Ensure user is authenticated first

  if (!user.currentOrganizationId) {
    redirect("/select-organization");
  }

  const organization = await prisma.organization.findUnique({
    where: { id: user.currentOrganizationId }
  });

  if (!organization) {
    // This should rarely happen - only if org was deleted after being set as current
    redirect("/select-organization");
  }

  return organization;
});
