"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SubscriptionInfo } from "@/types/platform";
import { CheckCircle } from "lucide-react";
import { ReactNode } from "react";
import { ActiveBanner, ExpiredBanner } from "./subscription-banners";

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
  const { isSubscriptionActive, isFree, statusText, statusType } = subscriptionInfo;

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
          {/* FREE plan - show upgrade option */}
          {isFree && (
            <>
              <Alert variant="default">
                <CheckCircle className="size-4" />
                <AlertTitle>Free plan - Active</AlertTitle>
                <AlertDescription>
                  You're currently on the free plan. Upgrade to PRO for advanced features.
                </AlertDescription>
              </Alert>
              <Button className="w-full" onClick={scrollToPricing}>
                Upgrade to PRO
              </Button>
            </>
          )}

          {/* PRO plan active - show customer portal */}
          {isSubscriptionActive && !isFree && (
            <>
              <ActiveBanner planDisplayName={planDisplayName} />
              {customerPortal}
            </>
          )}

          {/* PRO plan but subscription inactive */}
          {!isSubscriptionActive && !isFree && (
            <>
              <ExpiredBanner />
              <Button className="w-full" onClick={scrollToPricing}>
                Reactivate subscription
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
