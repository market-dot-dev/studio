"use server";

import { IntegrationType } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { requireOrganization, requireUser } from "../user-context-service";

/**
 * Check if organization has a GitHub integration
 */
export async function hasGitHubIntegration(organizationId?: string): Promise<boolean> {
  const org = organizationId ? { id: organizationId } : await requireOrganization();

  const integration = await prisma.integration.findUnique({
    where: {
      organizationId_type: {
        organizationId: org.id,
        type: IntegrationType.GITHUB_APP
      }
    }
  });

  return !!integration && integration.active;
}

/**
 * Get GitHub integration for organization
 */
export async function getGitHubIntegration(organizationId?: string) {
  const org = organizationId ? { id: organizationId } : await requireOrganization();

  return prisma.integration.findUnique({
    where: {
      organizationId_type: {
        organizationId: org.id,
        type: IntegrationType.GITHUB_APP
      }
    },
    include: {
      installedByUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
}

/**
 * Store GitHub App installation
 */
export async function storeGitHubInstallation(
  installationId: string,
  permissions: Record<string, string>,
  repositories?: any[]
): Promise<void> {
  const org = await requireOrganization();
  const user = await requireUser();

  await prisma.integration.upsert({
    where: {
      organizationId_type: {
        organizationId: org.id,
        type: IntegrationType.GITHUB_APP
      }
    },
    create: {
      organizationId: org.id,
      type: IntegrationType.GITHUB_APP,
      installationId,
      permissions,
      repositories: repositories || [],
      installedBy: user.id,
      active: true
    },
    update: {
      installationId,
      permissions,
      repositories: repositories || [],
      lastSyncedAt: new Date(),
      active: true
    }
  });
}

/**
 * Remove GitHub integration
 */
export async function removeGitHubIntegration(organizationId?: string): Promise<void> {
  const org = organizationId ? { id: organizationId } : await requireOrganization();

  await prisma.integration.deleteMany({
    where: {
      organizationId: org.id,
      type: IntegrationType.GITHUB_APP
    }
  });
}

/**
 * Basic validation of GitHub integration (database only)
 * Note: Install Octokit packages for full GitHub API validation
 */
export async function validateGitHubIntegration(organizationId?: string): Promise<{
  isValid: boolean;
  error?: string;
}> {
  try {
    const integration = await getGitHubIntegration(organizationId);

    if (!integration) {
      return { isValid: false, error: "No GitHub integration found" };
    }

    if (!integration.active) {
      return { isValid: false, error: "GitHub integration is inactive" };
    }

    // Basic validation - just check database
    // TODO: Add GitHub API validation once Octokit packages are installed
    return { isValid: true };
  } catch (error) {
    console.error("Error validating GitHub integration:", error);
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

/**
 * Generate GitHub App installation URL
 * Note: Update GITHUB_APP_SLUG environment variable
 */
export function getGitHubInstallationUrl(state?: string): string {
  const appSlug = process.env.GITHUB_APP_SLUG || "your-github-app";
  const baseUrl = `https://github.com/apps/${appSlug}/installations/new`;

  if (state) {
    return `${baseUrl}?state=${encodeURIComponent(state)}`;
  }

  return baseUrl;
}

/**
 * Get all integrations for current organization
 */
export async function getOrganizationIntegrations(organizationId?: string) {
  const org = organizationId ? { id: organizationId } : await requireOrganization();

  return prisma.integration.findMany({
    where: {
      organizationId: org.id
    },
    include: {
      installedByUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      installedAt: "desc"
    }
  });
}

/**
 * Update integration status
 */
export async function updateIntegrationStatus(
  integrationId: string,
  active: boolean
): Promise<void> {
  await prisma.integration.update({
    where: { id: integrationId },
    data: {
      active,
      lastSyncedAt: new Date()
    }
  });
}

/**
 * Basic webhook handler structure
 * Note: Implement full webhook handling once Octokit packages are installed
 */
export async function handleGitHubWebhook(
  action: string,
  installation: any,
  organizationId: string
): Promise<void> {
  console.log(`GitHub webhook received: ${action} for org ${organizationId}`);

  switch (action) {
    case "created":
      // Store installation data
      await storeGitHubInstallation(
        installation.id.toString(),
        installation.permissions || {},
        installation.repositories || []
      );
      break;

    case "deleted":
      await removeGitHubIntegration(organizationId);
      break;

    case "suspend":
      const integration = await getGitHubIntegration(organizationId);
      if (integration) {
        await updateIntegrationStatus(integration.id, false);
      }
      break;

    case "unsuspend":
      const activeIntegration = await getGitHubIntegration(organizationId);
      if (activeIntegration) {
        await updateIntegrationStatus(activeIntegration.id, true);
      }
      break;

    default:
      console.log(`Unhandled GitHub webhook action: ${action}`);
  }
}
