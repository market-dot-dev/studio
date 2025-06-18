"use client";

import { cancelSubscription } from "@/app/services/billing/subscription-service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button, ButtonProps } from "@/components/ui/button";
import { useState } from "react";

export const CancelSubscriptionBtn = ({
  subscriptionId,
  ...props
}: { subscriptionId: string } & ButtonProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        loading={loading}
        loadingText="Cancelling Subscription"
        disabled={loading}
        className="w-min"
        onClick={() => setDialogOpen(true)}
        {...props}
      >
        Cancel Subscription
      </Button>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="max-h-[calc(100vh-32px)] max-w-[calc(100vw-32px)] rounded-lg sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-stone-500">
              Are you sure you want to cancel your subscription?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDialogOpen(false)}>
              Stay subscribed
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" asChild>
              <Button
                size="sm"
                loading={loading}
                loadingText="Cancelling Subscription"
                disabled={loading}
                onClick={() => {
                  setLoading(true);
                  cancelSubscription(subscriptionId).finally(() => {
                    setLoading(false);
                    window.location.reload();
                  });
                }}
              >
                Cancel subscription
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
