import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getRootUrl } from "@/lib/domain";
import { cn } from "@/lib/utils";
import { CircleCheck, Clock } from "lucide-react";
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
    <Card className="mx-auto flex w-full flex-col p-5 pt-4 md:max-w-xl lg:max-w-md xl:max-w-lg">
      <div className="-ml-0.5 mb-3 flex items-center gap-2">
        {isActive ? (
          <CircleCheck size={18} className="shrink-0 fill-success stroke-white" />
        ) : (
          <Clock size={18} className="shrink-0 fill-warning stroke-white" />
        )}
        <p className={cn("font-bold text-sm", isActive ? "text-success" : "text-warning")}>
          {isActive ? "Subscribed" : "Cancelled"}
        </p>
      </div>
      <div className="mb-5 flex flex-col gap-1">
        <h3 className="text-lg font-bold text-stone-800">
          {isActive ? "You're Already Subscribed" : "Your Subscription is Ending Soon"}
        </h3>
        <p className="text-sm text-stone-500">
          {isActive ? (
            <>
              You currently have an active subscription to{" "}
              <span className="font-semibold text-stone-800">{tierName}</span>.
            </>
          ) : (
            <>
              Your subscription to <span className="font-semibold text-stone-800">{tierName}</span>{" "}
              has been cancelled. It'll be active until{" "}
              <span className="font-semibold text-stone-800">
                {expiryDate?.toLocaleDateString()}
              </span>
              .
            </>
          )}
        </p>
      </div>
      <Link href={subUrl} passHref>
        <Button variant="outline" className="w-full">
          Manage Subscription
        </Button>
      </Link>
    </Card>
  );
}
