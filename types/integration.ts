import { IntegrationType, Prisma } from "@/app/generated/prisma";

/**
 * Integration with user details
 */
export const includeIntegrationWithUser = Prisma.validator<Prisma.IntegrationDefaultArgs>()({
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

export type IntegrationWithUser = Prisma.IntegrationGetPayload<typeof includeIntegrationWithUser>;

/**
 * GitHub App installation data
 */
export interface GitHubInstallationData {
  installationId: string;
  permissions: Record<string, string>;
  repositories?: any[];
}

/**
 * Integration validation result
 */
export interface IntegrationValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Available integration types
 */
export const INTEGRATION_TYPES = {
  GITHUB_APP: IntegrationType.GITHUB_APP
} as const;
