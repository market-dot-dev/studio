"use server";

import { processGitHubInstallationCallback } from "@/app/services/integrations/github-integration-service";
import { getRootUrl } from "@/lib/domain";
import { redirect } from "next/navigation";

export default async function GitHubCallbackHandler({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const installationId = query["installation_id"] as string;
  const setupAction = query["setup_action"] as string;
  const state = query["state"] as string;
  const redirectUrl = getRootUrl("app", "/settings/integrations");

  // Handle different setup actions
  if (setupAction === "install" && installationId) {
    try {
      // Process the GitHub App installation
      await processGitHubInstallationCallback(installationId, state);
    } catch (error) {
      console.error("Error processing GitHub installation callback:", error);
      redirect(redirectUrl + "?error=github_install_failed");
    }
    // Redirect with success
    redirect(redirectUrl + "?success=github_installed");
  } else if (setupAction === "request") {
    // User requested installation but didn't complete it
    redirect(redirectUrl + "?info=github_install_cancelled");
  } else {
    // Invalid or missing parameters
    redirect(redirectUrl + "?error=invalid_github_callback");
  }
}
