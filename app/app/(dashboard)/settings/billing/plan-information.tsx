"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SubscriptionInfo } from "@/types/platform";
import { ReactNode } from "react";
import { ActiveBanner, ExpiredBanner, TrialBanner } from "./subscription-banners";

interface PlanInformationProps {
  subscriptionInfo: SubscriptionInfo;
  planDisplayName: string;
  customerPortal?: ReactNode;
}

function StatusBadge({ statusText, statusType }: { statusText: string; statusType: string }) {
  const variant =
    statusType === "active" ? "default" : statusType === "trial" ? "secondary" : "destructive";

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
  const {
    isTrialActive,
    isTrialExpired,
    isSubscriptionActive,
    daysLeft,
    trialEnd,
    statusText,
    statusType
  } = subscriptionInfo;

  const scrollToPricing = () => scrollToElement("pricing-plans");

  return (
    <Card>
      <CardHeader className="flex flex-col items-start gap-1">
        <div className="flex w-full items-center justify-between">
          <h3 className="text-xl font-bold">{planDisplayName}</h3>
          <StatusBadge statusText={statusText} statusType={statusType} />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {isTrialActive && trialEnd && (
            <>
              <TrialBanner daysLeft={daysLeft} trialEnd={trialEnd} />
              <Button className="w-full" onClick={scrollToPricing}>
                Upgrade now
              </Button>
            </>
          )}

          {!isTrialActive && !isSubscriptionActive && (
            <>
              <ExpiredBanner isTrialExpired={isTrialExpired} />
              <Button className="w-full" onClick={scrollToPricing}>
                Choose a plan
              </Button>
            </>
          )}

          {isSubscriptionActive && (
            <>
              <ActiveBanner planDisplayName={planDisplayName} />
              {customerPortal}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
