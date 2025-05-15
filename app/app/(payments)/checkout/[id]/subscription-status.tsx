import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getRootUrl } from "@/lib/domain";
import { cn, formatDate, formatSubscriptionExpiryDate } from "@/lib/utils";
import { CircleCheck, Clock } from "lucide-react";
import Link from "next/link";

interface Props {
  subscriptionId: string;
  tierName: string;
  expiryDate?: Date | null;
}

export function SubscriptionStatusCard({ subscriptionId, tierName, expiryDate }: Props) {
  // const subUrl = getRootUrl("app", `/c/subscriptions/${subscriptionId}`); // @NOTE: This page doesn't exist yet
  const subUrl = getRootUrl("app", "/c/");
  const isExpiring = !!expiryDate;

  const eyebrowText = isExpiring ? formatSubscriptionExpiryDate(expiryDate) : "Subscribed";
  const eyebrowColor = isExpiring ? "text-warning" : "text-success";
  const eyebrowIconFill = isExpiring ? "fill-warning" : "fill-success";
  const EyebrowIconComponent = isExpiring ? Clock : CircleCheck;

  return (
    <Card className="mx-auto flex w-full flex-col md:max-w-xl lg:max-w-md xl:max-w-lg">
      <div className="-ml-0.5 mb-4 flex items-center gap-2 px-5 pt-4">
        <EyebrowIconComponent size={18} className={cn("shrink-0 stroke-white", eyebrowIconFill)} />
        <p className={cn("font-bold text-sm tracking-tightish", eyebrowColor)}>{eyebrowText}</p>
      </div>
      <div className="mb-6 flex flex-col gap-1 px-5">
        <h3 className="text-lg font-bold text-foreground">
          {isExpiring ? `You've Cancelled Your Subscription` : "You're Already Subscribed"}
        </h3>
        <p className="text-sm text-stone-500">
          {isExpiring ? (
            <>
              Your subscription to <span className="font-semibold text-foreground">{tierName}</span>{" "}
              will be active until{" "}
              <span className="font-semibold text-foreground">
                {formatDate(expiryDate?.toLocaleDateString())}
              </span>
              .
            </>
          ) : (
            <>
              You currently have an active subscription to{" "}
              <span className="font-semibold text-foreground">{tierName}</span>.
            </>
          )}
        </p>
      </div>
      <Separator />
      <Link href={subUrl} passHref>
        <Button
          size="lg"
          variant="outline"
          className="w-full rounded-b-md rounded-t-none shadow-none"
        >
          Manage Subscription
        </Button>
      </Link>
    </Card>
  );
}
