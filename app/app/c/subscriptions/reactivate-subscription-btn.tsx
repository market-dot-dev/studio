"use client";

import { reactivateSubscription } from "@/app/services/billing/connect-subscription-service";
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
import { RotateCw } from "lucide-react";
import { useState } from "react";

export const ReactivateSubscriptionBtn = ({
  subscriptionId,
  ...props
}: { subscriptionId: string } & ButtonProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        size="sm"
        variant="default"
        loading={loading}
        loadingText="Reactivating Subscription"
        disabled={loading}
        className="w-min"
        onClick={() => setDialogOpen(true)}
        {...props}
      >
        <RotateCw />
        Reactivate Subscription
      </Button>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="max-h-[calc(100vh-32px)] max-w-[calc(100vw-32px)] rounded-lg sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Reactivate Subscription</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-stone-500">
              Would you like to reactivate your subscription? Your subscription will continue after
              the current period ends, and you'll be billed according to your plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDialogOpen(false)}>
              No, keep it cancelled
            </AlertDialogCancel>
            <AlertDialogAction variant="default" asChild>
              <Button
                size="sm"
                loading={loading}
                loadingText="Reactivating Subscription"
                disabled={loading}
                onClick={() => {
                  setLoading(true);
                  reactivateSubscription(subscriptionId).finally(() => {
                    setLoading(false);
                    window.location.reload();
                  });
                }}
              >
                Reactivate subscription
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
