"use client";

import type { SubscriptionCadence } from "@/app/services/StripeService";
import type {
  CheckoutType,
  TierWithFeatures,
} from "@/app/services/TierService";
import { Button, Switch } from "@tremor/react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import TierFeatureList from "@/components/features/tier-feature-list";
import { Feature } from "@prisma/client";
import { useState } from "react";
import { cn, parseTierDescription } from "@/lib/utils";
import { subscriptionCadenceShorthands } from "@/lib/tiers/subscription-cadence-shorthands";
import clsx from "clsx";

type TierCardProps = {
  url?: string;
  openUrlInNewTab?: boolean;
  tier: TierWithFeatures;
  buttonDisabled?: boolean;
  alignment?: "left" | "center";
  darkMode?: boolean;
  features?: Feature[];
  hasActiveFeatures?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export const generateLink = (
  url: string | null,
  tierId: string,
  annual: boolean,
) => {
  return `${url ? url : ""}/checkout/${tierId}${annual ? "?annual=true" : ""}`;
};

const CheckoutButton = ({
  url,
  openUrlInNewTab = false,
  tierId,
  annual = false,
  variant = "primary",
  checkoutType = "gitwallet",
  darkMode = false,
  disabled = false,
}: {
  url: string | null;
  openUrlInNewTab?: boolean;
  tierId: string;
  annual?: boolean;
  variant?: "secondary" | "primary";
  checkoutType?: CheckoutType;
  darkMode?: boolean;
  disabled?: boolean;
}) => {
  const checkoutUrl = generateLink(url, tierId, annual);

  return (
    <Link
      href={disabled ? "" : checkoutUrl}
      target={openUrlInNewTab ? "_blank" : "_self"}
    >
      <Button
        variant={variant}
        className={cn(
          "w-full rounded-md px-3 py-2 text-center text-sm font-medium shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow",
          darkMode
            ? "bg-white text-gray-900 hover:bg-gray-100"
            : "!bg-gradient-to-b from-gray-800 to-gray-950 text-white hover:bg-gray-700",
        )}
      >
        {checkoutType === "gitwallet" ? "Get Started" : "Contact Us"}
      </Button>
    </Link>
  );
};

const TierCard: React.FC<TierCardProps> = ({
  tier,
  url = null,
  darkMode = false,
  features = [],
  hasActiveFeatures,
  alignment = "left",
  className,
  children,
  buttonDisabled = false,
  openUrlInNewTab = false,
}) => {
  const [showAnnual, setShowAnnual] = useState(false);

  const containerClasses = darkMode
    ? "text-white bg-gray-900"
    : "text-gray-900 bg-white";
  const headingClasses = darkMode ? "text-white" : "text-gray-900";
  const textClasses = darkMode ? "text-gray-300" : "text-gray-500";

  const hasAnnual = (tier.priceAnnual || 0) > 0;
  const isntOnce = tier.cadence !== "once";
  const cadenceShorthand =
    subscriptionCadenceShorthands[tier.cadence as SubscriptionCadence];

  const directlyProvidedFeatures = !!features && features.length > 0;
  const tierFeatures =
    (directlyProvidedFeatures ? features : tier.features) || [];
  const parsedDescription = parseTierDescription(tier.description || "");

  return (
    <Card
      className={clsx(
        "relative flex h-full w-full flex-col justify-between p-6 pt-5",
        containerClasses,
        className,
      )}
    >
      <div
        className={clsx(
          "flex flex-col gap-6",
          alignment === "center" && "items-center",
        )}
      >
        <div>
          <h3
            className={clsx(
              "mb-1 font-geist text-lg font-semibold",
              alignment === "center" && "text-center",
              headingClasses,
            )}
          >
            {tier.name}
          </h3>
          <p
            className={clsx(
              "text-sm",
              alignment === "center" && "text-center",
              textClasses,
            )}
          >
            {tier.tagline}
          </p>
        </div>
        {tier.checkoutType === "gitwallet" && (
          <div
            className={clsx(
              "flex flex-col gap-1",
              alignment === "center" && "items-center",
            )}
          >
            <div className="text-4xl">
              <span className="font-geist-mono">
                $
                {showAnnual
                  ? Math.round((tier.priceAnnual || 0) / 12)
                  : tier.price}
              </span>
              {cadenceShorthand && (
                <span className="text-base/10 font-normal text-gray-500">
                  <span className="mr-px">/</span>
                  {cadenceShorthand}
                </span>
              )}
            </div>
            {hasAnnual && isntOnce ? (
              <div className="flex items-center gap-1.5">
                <p className="text-xxs font-medium uppercase tracking-wider text-gray-500">
                  Monthly
                </p>
                <Switch
                  checked={showAnnual}
                  onChange={() => setShowAnnual(!showAnnual)}
                />
                <p className="text-xxs font-medium uppercase tracking-wider text-gray-500">
                  Yearly
                </p>
              </div>
            ) : null}
          </div>
        )}
        <div className="flex flex-col gap-4">
          {hasActiveFeatures && tierFeatures.length !== 0 ? (
            <TierFeatureList features={tierFeatures} darkMode={darkMode} />
          ) : (
            parsedDescription.map((section, dex) => {
              if (section.text) {
                return (
                  <div key={dex}>
                    {section.text.map((text: string, index: number) => (
                      <p key={index} className={cn("text-sm text-stone-500", textClasses)}>
                        {text}
                      </p>
                    ))}
                  </div>
                );
              }

              return (
                <TierFeatureList
                  key={dex}
                  features={section.features.map(
                    (feature: string, index: number) => ({
                      id: index,
                      name: feature,
                      isEnabled: true,
                    }),
                  )}
                  darkMode={darkMode}
                />
              );
            })
          )}
        </div>
      </div>
      <div className="mt-12 w-full">
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
