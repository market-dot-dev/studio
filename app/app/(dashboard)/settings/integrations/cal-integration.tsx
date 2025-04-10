"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface CalIntegrationProps {
  isConnected: boolean;
}

export default function CalIntegration({ isConnected }: CalIntegrationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [disconnecting, setDisconnecting] = useState(false);

  // Check for success and error messages in URL
  const success = searchParams.get("success");
  const error = searchParams.get("error");

  // Show success toast once when the component mounts
  if (success === "true") {
    toast.success("Cal.com integration connected successfully!");
    
    // Remove the success query param
    const params = new URLSearchParams(searchParams);
    params.delete("success");
    router.replace(`/settings/integrations?${params.toString()}`);
  }

  // Show error toast once when the component mounts
  if (error) {
    toast.error(`Failed to connect Cal.com: ${error}`);
    
    // Remove the error query param
    const params = new URLSearchParams(searchParams);
    params.delete("error");
    router.replace(`/settings/integrations?${params.toString()}`);
  }

  const handleDisconnect = async () => {
    try {
      setDisconnecting(true);
      const response = await fetch("/api/integrations/cal/disconnect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to disconnect Cal.com integration");
      }

      toast.success("Cal.com integration disconnected successfully");
      router.refresh();
    } catch (error) {
      console.error("Error disconnecting Cal.com:", error);
      toast.error("Failed to disconnect Cal.com integration");
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl">Cal.com</CardTitle>
          <CardDescription>
            Let users book meetings with you using your Cal.com schedule.
          </CardDescription>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-calendar-days"
          >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
            <path d="M8 14h.01" />
            <path d="M12 14h.01" />
            <path d="M16 14h.01" />
            <path d="M8 18h.01" />
            <path d="M12 18h.01" />
            <path d="M16 18h.01" />
          </svg>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mt-2">
          Connect your Cal.com account to allow prospects to book meetings with you directly through an embeddable widget.
        </p>
      </CardContent>
      <CardFooter>
        {isConnected ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={disconnecting}>
                {disconnecting ? "Disconnecting..." : "Disconnect"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Disconnect Cal.com Integration</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to disconnect your Cal.com integration? This will remove
                  any booking capabilities until you reconnect.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDisconnect}>
                  Disconnect
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Link href="/api/integrations/cal/authorize">
            <Button>Connect Cal.com</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
} 