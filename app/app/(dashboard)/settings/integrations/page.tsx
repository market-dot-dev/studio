"use server";

import {
  getGitHubInstallationUrl,
  getGitHubIntegration,
  hasGitHubIntegration,
  isGitHubAppConfigured,
  validateGitHubIntegration
} from "@/app/services/integrations/github-integration-service";
import { requireOrganization } from "@/app/services/user-context-service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { ConnectGitHubBtn } from "./ConnectGitHubBtn";
import { DisconnectGitHubBtn } from "./DisconnectGitHubBtn";
import { GitHubIntegrationStatus } from "./GitHubIntegrationStatus";

export default async function IntegrationsSettings({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const org = await requireOrganization();
  const query = await searchParams;
  const success = query?.success as string;
  const error = query?.error as string;
  const info = query?.info as string;

  // Check if GitHub App is properly configured
  const isGitHubConfigured = await isGitHubAppConfigured();

  if (!isGitHubConfigured) {
    return (
      <div className="flex max-w-screen-md flex-col space-y-4">
        <h2 className="text-xl font-bold">GitHub Integration</h2>
        <Alert variant="warning">
          <AlertTriangle />
          <AlertTitle>GitHub App Not Configured</AlertTitle>
          <AlertDescription>
            <p>GitHub App is not configured. Please set up the required environment variables:</p>
            <ul className="mt-2 list-inside list-disc">
              <li>GITHUB_APP_ID</li>
              <li>GITHUB_APP_PRIVATE_KEY</li>
              <li>GITHUB_APP_CLIENT_ID</li>
              <li>GITHUB_APP_CLIENT_SECRET</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const hasIntegration = await hasGitHubIntegration(org.id);
  const integration = hasIntegration ? await getGitHubIntegration(org.id) : null;

  // Validate integration if it exists
  let validationResult = null;
  if (integration) {
    validationResult = await validateGitHubIntegration(org.id);
  }

  const installationUrl = await getGitHubInstallationUrl();

  return (
    <div className="flex max-w-screen-md flex-col space-y-4">
      {/* Callback Status Messages */}
      {success === "github_installed" && (
        <Alert variant="default" className="border-green-200 bg-green-50">
          <CheckCircle className="size-4 text-green-600" />
          <AlertTitle className="text-green-800">GitHub App Installed Successfully!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your GitHub integration is now active and ready to use.
          </AlertDescription>
        </Alert>
      )}

      {error === "github_install_failed" && (
        <Alert variant="destructive">
          <XCircle className="size-4" />
          <AlertTitle>GitHub Installation Failed</AlertTitle>
          <AlertDescription>
            There was an error processing your GitHub App installation. Please try again or contact
            support if the issue persists.
          </AlertDescription>
        </Alert>
      )}

      {error === "invalid_github_callback" && (
        <Alert variant="destructive">
          <XCircle className="size-4" />
          <AlertTitle>Invalid GitHub Callback</AlertTitle>
          <AlertDescription>
            The GitHub installation callback was invalid. Please try installing the app again.
          </AlertDescription>
        </Alert>
      )}

      {info === "github_install_cancelled" && (
        <Alert variant="default" className="border-blue-200 bg-blue-50">
          <Info className="size-4 text-blue-600" />
          <AlertTitle className="text-blue-800">GitHub Installation Cancelled</AlertTitle>
          <AlertDescription className="text-blue-700">
            You can install the GitHub App anytime to enable repository verification and advanced
            features.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex max-w-screen-md flex-col space-y-10">
        {hasIntegration && integration ? (
          <>
            <div className="flex flex-col gap-4">
              <div className="flex w-full flex-wrap justify-between gap-x-6 gap-y-2">
                <div className="inline-flex w-fit items-center gap-2">
                  <h2 className="text-xl font-bold">GitHub Integration</h2>
                  <Badge
                    variant="secondary"
                    size="sm"
                    tooltip="Installation ID"
                    className="translate-y-px font-mono"
                  >
                    {integration.installationId}
                  </Badge>
                </div>

                {integration.active && (
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-success">
                    <span className="size-1.5 rounded-full bg-success" />
                    Connected
                  </div>
                )}
              </div>

              <GitHubIntegrationStatus
                integration={integration}
                validationResult={validationResult}
                installationUrl={installationUrl}
              />
            </div>

            {integration.active && (
              <>
                <Separator className="my-6" />

                <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-4">
                  <h2 className="text-xl font-bold">Danger Zone</h2>
                  <DisconnectGitHubBtn installationId={integration.installationId} />
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">Connect GitHub App</h2>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Connect your GitHub App to verify repository ownership and enable advanced features.
                This integration allows you to showcase your open source projects and contributions.
              </p>
              <ConnectGitHubBtn installationUrl={installationUrl} className="w-fit" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
