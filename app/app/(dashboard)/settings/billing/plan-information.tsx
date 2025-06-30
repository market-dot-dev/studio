"use client";

import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SubscriptionInfo } from "@/types/platform";
import { hasActiveProSubscription } from "@/utils/subscription-utils";
import { RotateCcw } from "lucide-react";
import { ReactNode } from "react";
import { ActiveBanner, ExpiredBanner, UpgradeBanner } from "./subscription-banners";

interface PlanInformationProps {
  subscriptionInfo: SubscriptionInfo;
  planDisplayName: string;
  customerPortal?: ReactNode;
}

function StatusBadge({
  statusText,
  statusType
}: {
  statusText: string;
  statusType: SubscriptionInfo["statusType"];
}) {
  let variant: BadgeProps["variant"] | undefined;
  switch (statusType) {
    case "active":
      variant = "success";
      break;
    case "inactive":
      variant = "destructive";
      break;
    default:
      variant = "secondary";
      break;
  }

  return <Badge variant={variant}>{statusText}</Badge>;
}

function scrollToElement(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

export function PlanInformation({
  subscriptionInfo,
  planDisplayName,
  customerPortal
}: PlanInformationProps) {
  const { isSubscriptionActive, isFree, statusText, statusType } = subscriptionInfo;
  const hasActivePro = hasActiveProSubscription(subscriptionInfo);
  const hasInactiveProSubscription = !isSubscriptionActive && !isFree;

  const scrollToPricing = () => scrollToElement("pricing-plans");

  return (
    <Card>
      <CardHeader className="flex flex-col items-start gap-1 py-5">
        <div className="flex w-full items-center justify-between">
          <h3 className="text-xl/6 font-bold">{planDisplayName}</h3>
          {statusType !== "free" && <StatusBadge statusText={statusText} statusType={statusType} />}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* FREE plan - show upgrade option */}
          {isFree && (
            <>
              <UpgradeBanner />
              <Button variant="outline" className="w-full" onClick={scrollToPricing}>
                Upgrade to Pro
              </Button>
            </>
          )}

          {/* Pro plan active - show customer portal */}
          {hasActivePro && (
            <>
              <ActiveBanner />
              {customerPortal}
            </>
          )}

          {/* Pro plan but subscription inactive */}
          {hasInactiveProSubscription && (
            <>
              <ExpiredBanner />
              <Button variant="outline" className="w-full" onClick={scrollToPricing}>
                <RotateCcw />
                Reactivate subscription
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
