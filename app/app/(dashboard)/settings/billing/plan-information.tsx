"use client";

import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SubscriptionInfo } from "@/types/platform";
import { hasActiveProSubscription } from "@/utils/subscription-utils";
import { RotateCcw } from "lucide-react";
import { ReactNode } from "react";
import { ActiveBanner, CustomBanner, ExpiredBanner, UpgradeBanner } from "./subscription-banners";

interface PlanInformationProps {
  subscriptionInfo: SubscriptionInfo;
  planDisplayName: string;
  customerPortal?: ReactNode;
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
  const { isSubscriptionActive, isFree, isCustom, statusText, statusType } = subscriptionInfo;
  const hasActivePro = hasActiveProSubscription(subscriptionInfo);
  const hasInactiveProSubscription = !isSubscriptionActive && !isFree;

  const badgeVariant: BadgeProps["variant"] =
    statusType === "active" ? "success" : statusType === "inactive" ? "destructive" : "secondary";

  const scrollToPricing = () => scrollToElement("pricing-plans");

  return (
    <Card>
      <CardHeader className="flex flex-col items-start gap-1 py-5">
        <div className="flex w-full items-center justify-between">
          <h3 className="text-xl/6 font-bold">{planDisplayName}</h3>
          {statusType !== "free" && <Badge variant={badgeVariant}>{statusText}</Badge>}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Show appropriate banner and actions based on subscription status - only first matching condition will render */}
          {(() => {
            if (isFree) {
              return (
                <>
                  <UpgradeBanner />
                  <Button variant="outline" className="w-full" onClick={scrollToPricing}>
                    Upgrade to Pro
                  </Button>
                </>
              );
            }

            if (isCustom) {
              return <CustomBanner />;
            }

            if (hasActivePro) {
              return (
                <>
                  <ActiveBanner />
                  {customerPortal}
                </>
              );
            }

            if (hasInactiveProSubscription) {
              return (
                <>
                  <ExpiredBanner />
                  <Button variant="outline" className="w-full" onClick={scrollToPricing}>
                    <RotateCcw />
                    Reactivate subscription
                  </Button>
                </>
              );
            }

            return null;
          })()}
        </div>
      </CardContent>
    </Card>
  );
}
