"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IntegrationWithUser } from "@/types/integration";
import { AlertTriangle, CheckCircle, ExternalLink, RefreshCw, XCircle } from "lucide-react";
import Link from "next/link";

interface GitHubIntegrationStatusProps {
  integration: IntegrationWithUser;
  validationResult: {
    isValid: boolean;
    error?: string;
    installationData?: any;
  } | null;
  installationUrl: string;
}

export function GitHubIntegrationStatus({
  integration,
  validationResult,
  installationUrl
}: GitHubIntegrationStatusProps) {
  if (!integration.active) {
    return (
      <Alert variant="warning">
        <AlertTriangle />
        <AlertTitle>Integration Inactive</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>
            Your GitHub App integration is not currently active. This may be due to the app being
            suspended or uninstalled from GitHub.
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href={installationUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 size-3" />
              Reinstall App
            </Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!validationResult) {
    return (
      <Alert variant="default">
        <RefreshCw className="animate-spin" />
        <AlertTitle>Validating Integration...</AlertTitle>
        <AlertDescription>Checking GitHub App installation status...</AlertDescription>
      </Alert>
    );
  }

  if (!validationResult.isValid) {
    return (
      <Alert variant="destructive">
        <XCircle />
        <AlertTitle>Integration Error</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>{validationResult.error || "Unable to validate GitHub App installation"}</p>
          <Button asChild size="sm" variant="outline">
            <Link href={installationUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 size-3" />
              Reinstall App
            </Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const installationData = validationResult.installationData;

  return (
    <div className="space-y-4">
      <Alert variant="success">
        <CheckCircle />
        <AlertTitle>Integration Active</AlertTitle>
        <AlertDescription>
          Your GitHub App is successfully connected and functioning properly.
        </AlertDescription>
      </Alert>

      {installationData && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Installation Details</h3>

          <div className="grid gap-3 text-sm">
            {installationData.account && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Account:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{installationData.account.login}</span>
                  <Badge variant="outline" size="sm">
                    {installationData.account.type}
                  </Badge>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Repository Access:</span>
              <Badge variant="secondary" size="sm">
                {installationData.repositorySelection === "all"
                  ? "All Repositories"
                  : "Selected Repositories"}
              </Badge>
            </div>

            {integration.installedByUser && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Installed by:</span>
                <span className="text-sm">
                  {integration.installedByUser.name || integration.installedByUser.email}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last synced:</span>
              <span className="text-sm">
                {integration.lastSyncedAt
                  ? new Date(integration.lastSyncedAt).toLocaleDateString()
                  : "Never"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
