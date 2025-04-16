"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { validateMarketExpert } from "@/lib/market";
import { User } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function ConnectionRequired({ user }: { user: User }) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    validateMarketExpert(
      user,
      () => {
        setIsConnecting(false);
      },
      (error) => {
        toast.error(error);
      },
      () => {
        toast.success("Market.dev account connected successfully");
      }
    ).catch((error) => {
      console.error(error);
      toast.error(`Error connecting to market.dev: ${error}`);
      setIsConnecting(false);
    });
  };

  return (
    <div className="from-muted/50 to-muted/30 relative space-y-8 rounded-lg border bg-gradient-to-b p-8">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.343 0L13.857 8.485 15.272 9.9l7.9-7.9h-.83zm5.657 0L19.514 8.485 20.93 9.9l8.485-8.485h-.485zM3.715 0L0 3.715l1.414 1.414L8.485 0H3.715zm10.285 0L6.485 7.515l1.414 1.414L15.485 0H14zM38.657 0l-8.485 8.485 1.415 1.415 7.9-7.9h-.83zm5.657 0l-7.515 7.515 1.414 1.414L45.8 0h-1.486zm5.657 0l-6.485 6.485 1.414 1.414L54.627 0h-4.686zM32.343 0L26.514 5.828 27.93 7.242 34.97 0h-2.627zM44.143 0L38.314 5.828 39.73 7.242 46.77 0h-2.627zM27.343 0L21.514 5.828 22.93 7.242 29.97 0h-2.627zM39.143 0L33.314 5.828 34.73 7.242 41.77 0h-2.627zm-16.057 0L17.514 5.828 18.93 7.242 25.97 0h-2.884zm5.657 0L23.172 5.828 24.586 7.242 31.627 0h-2.884zM60 0L49.515 10.485l1.414 1.414L60 2.827V0zM0 0l10.485 10.485-1.414 1.414L0 2.827V0z' fill='%23000000' fill-opacity='0.35' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}
      />

      <div className="relative space-y-4">
        <h2 className="text-4xl font-bold tracking-tight">Get listed on market.dev</h2>
        <p className="text-muted-foreground max-w-2xl text-xl">
          Join a marketplace of services & resources from top open source developers in any
          ecosystem.
        </p>
      </div>

      <Card className="bg-background/95 relative overflow-hidden border backdrop-blur">
        <Image src="/market-dot-dev.png" alt="Market.dev" width={1000} height={1000} />
      </Card>

      <div className="relative flex flex-col gap-4 sm:flex-row">
        <Button
          loading={isConnecting}
          loadingText="Connecting to market.dev"
          onClick={() => handleConnect()}
        >
          Connect to market.dev
        </Button>
      </div>
    </div>
  );
}
