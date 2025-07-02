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
 * GitHub account information (with nullable fields)
 */
export interface GitHubAccountInfo {
  login: string | null;
  id: number | null;
  type: string | null;
  avatarUrl: string | null;
  htmlUrl: string | null;
}

/**
 * Generic account info structure for different integration types
 */
export interface IntegrationAccountInfo {
  // GitHub specific
  login?: string | null;
  id?: number | null;
  type?: string | null;
  avatarUrl?: string | null;
  htmlUrl?: string | null;

  // Future: Stripe, other integrations can add their own fields
  // stripeAccountId?: string;
  // etc...
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
