"use client";

import { cancelSubscription } from "@/app/services/subscription-service";
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

const CancelSubscriptionButton = ({ subscriptionId }: { subscriptionId: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        size="sm"
        variant="destructive"
        loading={loading}
        loadingText="Cancelling Subscription"
        disabled={loading}
        className="w-min"
        onClick={() => setDialogOpen(true)}
      >
        Cancel Subscription
      </Button>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-stone-500">
              Are you sure you want to cancel your subscription?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDialogOpen(false)}>
              No, keep subscription
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                size="sm"
                variant="destructive"
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

export default CancelSubscriptionButton;
