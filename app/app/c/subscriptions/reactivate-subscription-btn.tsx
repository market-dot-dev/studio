"use client";

import { reactivateSubscription } from "@/app/services/subscription-service";
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
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const ReactivateSubscriptionBtn = ({ subscriptionId }: { subscriptionId: string }) => {
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
      >
        Reactivate Subscription
      </Button>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
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
