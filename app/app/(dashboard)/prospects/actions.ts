"use server";

import { archiveProspect } from "@/app/services/prospects/prospect-service";
import { requireOrganization } from "@/app/services/user-context-service";
import { revalidatePath } from "next/cache";

const pathsToRevalidate = ["/prospects", "/prospects/archive"] as const;

type ArchiveProspectActionInput = {
  prospectId: string;
};

export async function archiveProspectAction({ prospectId }: ArchiveProspectActionInput) {
  if (!prospectId) {
    throw new Error("Prospect ID is required to archive a prospect");
  }

  const organization = await requireOrganization();

  await archiveProspect(organization.id, prospectId);

  pathsToRevalidate.forEach((path) => {
    revalidatePath(path);
  });

  return { success: true };
}

