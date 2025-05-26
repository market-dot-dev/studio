"use client";

import { StripeAccountStatus } from "@/app/app/(dashboard)/settings/payment/StripeAccountStatus";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Banknote, CreditCard, Mail } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ConnectStripeScreenProps {
  onComplete: (connected: boolean) => void;
  onBack: () => void;
  isConnected: boolean;
}

// Custom unconnected state component that matches the design
function UnconnectedStripeStatus({
  onConnect,
  isConnecting
}: {
  onConnect: () => void;
  isConnecting: boolean;
}) {
  return (
    <div className={cn("rounded-lg border border-dashed border-stone-300 bg-stone-50 p-6")}>
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="rounded-full bg-white p-3 shadow-sm">
          <CreditCard className="size-8 text-stone-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold tracking-tight text-stone-900">
            Connect your Stripe account
          </h3>
          <p className="max-w-md text-sm text-stone-600">
            Connect Stripe to start accepting payments and manage your freelance business finances.
          </p>
        </div>
        <Button onClick={onConnect} disabled={isConnecting} className="flex items-center gap-2">
          <Image
            src="/stripe-icon-square.svg"
            alt="Stripe logo"
            height={18}
            width={18}
            className="rounded-[3px]"
          />
          {isConnecting ? "Connecting..." : "Connect with Stripe"}
        </Button>
      </div>
    </div>
  );
}

// Status item component
interface StatusItemProps {
  icon: React.ReactNode;
  title: string;
  iconColor?: string;
}

function StatusItem({ icon, title, iconColor }: StatusItemProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className={cn("flex-shrink-0", iconColor)}>{icon}</div>
      <p className="text-sm font-medium text-stone-900">{title}</p>
    </div>
  );
}

export function ConnectStripeScreen({
  onComplete,
  onBack,
  isConnected: initialConnected
}: ConnectStripeScreenProps) {
  const [isConnected, setIsConnected] = useState(initialConnected);
  const [isConnecting, setIsConnecting] = useState(false);

  // Simulate Stripe connection process
  const handleConnect = async () => {
    setIsConnecting(true);

    // Simulate OAuth flow with realistic delay
    await new Promise((resolve) => setTimeout(resolve, 2500));

    setIsConnected(true);
    setIsConnecting(false);
  };

  const handleSkip = () => {
    onComplete(false);
  };

  const handleContinue = () => {
    onComplete(isConnected);
  };

  return (
    <div className="space-y-8">
      {/* GitHub Logo */}
      <div className="flex justify-center">
        <Image
          src="/gw-logo-nav.png"
          alt="Gitwallet Logo"
          className="size-9 shrink-0"
          height={36}
          width={36}
          priority
        />
      </div>

      {/* Header */}
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-stone-900">
          Connect Your Payment Account
        </h2>
        <p className="text-sm text-stone-600">
          Set up Stripe to accept payments and manage your earnings
        </p>
      </div>

      {/* Main Content */}
      <div className="mx-auto">
        {/* StripeStatus wrapper with bg-stone-150 and ring */}
        <div className="rounded-lg bg-stone-150 p-8 ring-1 ring-inset ring-black/10">
          {isConnected ? (
            <StripeAccountStatus canSell={true} messageCodes={[]} />
          ) : (
            <UnconnectedStripeStatus onConnect={handleConnect} isConnecting={isConnecting} />
          )}

          {/* Status items below */}
          <div className="mt-6 space-y-1">
            <StatusItem
              icon={<Banknote className="size-5" />}
              title={isConnected ? "You can accept payments" : "You can't accept payments"}
              iconColor={isConnected ? "text-stone-600" : "text-red-600"}
            />
            <StatusItem
              icon={<Mail className="size-5" />}
              title="Contact forms available"
              iconColor="text-green-600"
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>

        <div className="flex gap-3">
          {isConnected ? (
            <Button onClick={handleContinue} disabled={isConnecting}>
              Next
            </Button>
          ) : (
            <Button variant="ghost" onClick={handleSkip}>
              Skip
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
