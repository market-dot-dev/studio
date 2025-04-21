"use client";

import type { SubscriptionCadence } from "@/app/services/StripeService";
import type { CheckoutType, TierWithCount } from "@/app/services/TierService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { subscriptionCadenceShorthands } from "@/lib/tiers/subscription-cadence-shorthands";
import { cn, parseTierDescription } from "@/lib/utils";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

type TierCardProps = {
  url?: string;
  openUrlInNewTab?: boolean;
  tier: TierWithCount;
  buttonDisabled?: boolean;
  alignment?: "left" | "center";
  darkMode?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export const generateLink = (url: string | null, tierId: string, annual: boolean) => {
  return `${url ? url : ""}/checkout/${tierId}${annual ? "?annual=true" : ""}`;
};

const CheckoutButton = ({
  url,
  openUrlInNewTab = false,
  tierId,
  annual = false,
  variant = "default",
  checkoutType = "gitwallet",
  darkMode = false,
  disabled = false
}: {
  url: string | null;
  openUrlInNewTab?: boolean;
  tierId: string;
  annual?: boolean;
  variant?: "secondary" | "default";
  checkoutType?: CheckoutType;
  darkMode?: boolean;
  disabled?: boolean;
}) => {
  const checkoutUrl = generateLink(url, tierId, annual);

  const buttonElement = (
    <Button
      variant={variant}
      className={cn(
        "w-full",
        darkMode && "!bg-white !text-stone-800 hover:bg-stone-100", // @TODO: Styling fix needed
        disabled && "cursor-not-allowed opacity-60"
      )}
      disabled={disabled}
    >
      {checkoutType === "gitwallet" ? "Get Started" : "Get in touch"}
    </Button>
  );

  // If disabled, only render the button without the link
  if (disabled) {
    return buttonElement;
  }

  // Otherwise wrap with Link
  return (
    <Link href={checkoutUrl} target={openUrlInNewTab ? "_blank" : "_self"}>
      {buttonElement}
    </Link>
  );
};

const TierCard: React.FC<TierCardProps> = ({
  tier,
  url = null,
  darkMode = false,
  alignment = "left",
  className,
  children,
  buttonDisabled = false,
  openUrlInNewTab = false
}) => {
  const [showAnnual, setShowAnnual] = useState(false);

  const containerClasses = darkMode ? "text-white bg-stone-900" : "text-stone-900 bg-white";
  const headingClasses = darkMode ? "text-white" : "text-stone-900";
  const textClasses = darkMode ? "text-stone-300" : "text-stone-500";

  const hasAnnual = (tier.priceAnnual || 0) > 0;
  const isntOnce = tier.cadence !== "once";
  const cadenceShorthand = subscriptionCadenceShorthands[tier.cadence as SubscriptionCadence];

  const parsedDescription = parseTierDescription(tier.description || "");

  return (
    <Card
      className={clsx(
        "relative flex size-full flex-col justify-between p-6 pt-5",
        containerClasses,
        className
      )}
    >
      <div className={clsx("flex flex-col gap-4", alignment === "center" && "items-center")}>
        <div>
          <h3
            className={clsx(
              "mb-1 text-lg font-semibold",
              alignment === "center" && "text-center",
              headingClasses
            )}
          >
            {tier.name}
          </h3>
          <p className={clsx("text-sm", alignment === "center" && "text-center", textClasses)}>
            {tier.tagline}
          </p>
        </div>
        {tier.checkoutType === "gitwallet" && (
          <div className={clsx("flex flex-col gap-1", alignment === "center" && "items-center")}>
            <p className="h-fit text-4xl">
              <span className="tracking-tight">
                ${showAnnual ? Math.round((tier.priceAnnual || 0) / 12) : tier.price}
              </span>
              {cadenceShorthand && (
                <span
                  className={cn(
                    "text-base/10 font-normal",
                    darkMode ? "text-stone-500" : "text-stone-400"
                  )}
                >
                  <span className="mr-px">/</span>
                  {cadenceShorthand}
                </span>
              )}
            </p>
            {hasAnnual && isntOnce ? (
              <div className="flex items-center justify-center gap-1.5">
                <p className="text-xxs font-medium uppercase tracking-wider text-stone-500">
                  Monthly
                </p>
                <Switch checked={showAnnual} onCheckedChange={() => setShowAnnual(!showAnnual)} />
                <p className="text-xxs font-medium uppercase tracking-wider text-stone-500">
                  Yearly
                </p>
              </div>
            ) : null}
          </div>
        )}
        <div className="flex flex-col gap-4">
          {parsedDescription.map((section, dex) => {
            if (section.text) {
              return (
                <div key={dex}>
                  {section.text.map((text: string, index: number) => (
                    <p key={index} className={cn("text-sm", textClasses)}>
                      {text}
                    </p>
                  ))}
                </div>
              );
            }
          })}
        </div>
      </div>
      <div className="mt-8 w-full">
        {children || (
          <CheckoutButton
            url={url}
            openUrlInNewTab={openUrlInNewTab}
            tierId={tier.id}
            annual={showAnnual && isntOnce}
            checkoutType={tier.checkoutType as CheckoutType}
            darkMode={darkMode}
            disabled={buttonDisabled}
          />
        )}
      </div>
    </Card>
  );
};

export default TierCard;
