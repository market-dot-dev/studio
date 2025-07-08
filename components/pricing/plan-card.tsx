"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { ReactNode } from "react";

interface PlanCardProps {
  title: string;
  description: string;
  price: ReactNode;
  transactionFee: string;
  buttonLabel: string;
  isCurrentPlan?: boolean;
  priceSubtext?: ReactNode;
  features?: ReactNode;
  disabled?: boolean;
  action?: () => Promise<void> | void;
  className?: string;
}

export function PlanCard({
  title,
  description,
  price,
  priceSubtext,
  transactionFee,
  features,
  isCurrentPlan = false,
  disabled,
  buttonLabel,
  action,
  className
}: PlanCardProps) {
  // Only check `disabled` if it's explicitly set
  const isDisabled = disabled !== undefined ? disabled : isCurrentPlan;

  return (
    <form action={action} className="relative size-full font-normal tracking-normal">
      <Card className="flex h-full flex-col justify-between shadow-border">
        <div className="flex flex-col px-6 pb-6 pt-5 @3xl:pb-8">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold tracking-tightish">{title}</h3>
            {isCurrentPlan && (
              <Badge size="sm" variant="outline" className="h-fit translate-y-px">
                Current Plan
              </Badge>
            )}
          </div>

          <p className="mb-6 text-pretty text-sm text-muted-foreground">{description}</p>

          <div className="relative mb-6">
            <div className="flex h-8 items-center text-3xl font-semibold tracking-tight">
              {price}
            </div>
            {priceSubtext}
          </div>

          <div className="mb-auto flex items-start gap-2 @3xl:mb-5">
            <CreditCard className="size-4 shrink-0 translate-y-0.5 text-muted-foreground" />
            <span className="text-pretty text-sm text-muted-foreground">{transactionFee}</span>
          </div>

          {features && <div className="mt-auto space-y-1">{features}</div>}
        </div>

        <div className="px-6 pb-6">
          <Button
            type="submit"
            variant={isDisabled ? "secondary" : "default"}
            className="w-full"
            disabled={isDisabled}
          >
            {buttonLabel}
          </Button>
        </div>
      </Card>
    </form>
  );
}
