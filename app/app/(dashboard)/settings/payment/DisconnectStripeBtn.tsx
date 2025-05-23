"use client";

import { disconnectVendorStripeAccount } from "@/app/services/stripe/stripe-vendor-service";
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
import { useEffect } from "react";

interface DisconnectStripeBtnProps {
  stripeAccountId?: string;
}

export function DisconnectStripeBtn({ stripeAccountId }: DisconnectStripeBtnProps) {
  // This is to refresh the onboarding guide if it exists
  useEffect(() => {
    // Call the refreshOnboarding function if it exists
    if (window && Object.prototype.hasOwnProperty.call(window, "refreshOnboarding")) {
      (window as any).refreshOnboarding();
    }
  }, []);

  const handleDisconnect = async () => {
    try {
      await disconnectVendorStripeAccount();
      location.reload();
    } catch (error) {
      console.error("Failed to disconnect Stripe account:", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={!stripeAccountId}>
          Disconnect Stripe Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will disconnect your Stripe account. You will not be able to receive payments until
            you reconnect.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDisconnect}>Disconnect</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
