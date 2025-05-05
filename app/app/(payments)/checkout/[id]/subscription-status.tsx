import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getRootUrl } from "@/lib/domain";
import { AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

interface Props {
  subscriptionId: string;
  tierName: string;
  isActive: boolean;
  expiryDate?: Date | null;
}

export function SubscriptionStatus({ subscriptionId, tierName, isActive, expiryDate }: Props) {
  // const subUrl = getRootUrl("app", `/c/subscriptions/${subscriptionId}`); // @NOTE: This page doesn't exist yet
  const subUrl = getRootUrl("app", "/c/");

  return (
    <Card className="mx-auto flex w-full flex-col gap-4 p-6 md:max-w-xl lg:max-w-md xl:max-w-lg">
      <div className="flex items-start gap-4">
        {/* @TODO: text-success and text-warning instead, once available. */}
        {isActive ? (
          <CheckCircle className="size-6 shrink-0 text-green-500" />
        ) : (
          <AlertCircle className="size-6 shrink-0 text-amber-500" />
        )}
        <div>
          <h3 className="text-lg font-medium text-stone-800">
            {isActive ? "Active Subscription" : "Subscription Ending Soon"}
          </h3>
          <p className="mt-1 text-sm text-stone-600">
            {isActive
              ? `You currently have an active subscription to ${tierName}.`
              : `Your subscription to ${tierName} has been cancelled but remains active until ${expiryDate?.toLocaleDateString()}.`}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Link href={subUrl} passHref>
          <Button variant="outline" size="sm">
            Manage Subscription
          </Button>
        </Link>
      </div>
    </Card>
  );
}
