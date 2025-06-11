"use client";

import { removeGitHubIntegration } from "@/app/services/integrations/github-integration-service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface DisconnectGitHubBtnProps {
  installationId: string;
}

export function DisconnectGitHubBtn({ installationId }: DisconnectGitHubBtnProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await removeGitHubIntegration();
      // Reload the page to reflect changes, similar to Stripe disconnect
      location.reload();
    } catch (error) {
      console.error("Error disconnecting GitHub:", error);
      alert("Failed to disconnect GitHub integration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 size-4" />
          Disconnect GitHub
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Disconnect GitHub Integration</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to disconnect your GitHub App integration? This will:
            <br />
            <br />
            • Remove access to your repositories
            <br />
            • Disable GitHub-based features
            <br />
            • Require reinstallation to reconnect
            <br />
            <br />
            This action cannot be undone, but you can reinstall the app later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDisconnect} disabled={isLoading}>
            {isLoading ? "Disconnecting..." : "Disconnect"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
