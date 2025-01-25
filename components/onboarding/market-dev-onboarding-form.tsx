"use client";

import { User } from "@prisma/client";
import { Site } from "@prisma/client";
import MarketDevProfileForm from "./market-dev-profile-form";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { refreshAndGetState } from "@/app/services/onboarding/OnboardingService";
import { AlertCircleIcon } from "lucide-react";
import { Button } from "@tremor/react";
import LoadingDots from "../icons/loading-dots";

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export default function MarketDevOnboardingForm({
  user,
  currentSite,
  onComplete,
}: {
  user: User;
  currentSite?: Site;
  onComplete: () => void;
}) {
  const [validateMarketExpertLoading, setValidateMarketExpertLoading] =
    useState(true);
  const [validateMarketExpertError, setValidateMarketExpertError] = useState<
    string | null
  >(null);

  const mounted = useMounted();

  const validateMarketExpert = async () => {
    setValidateMarketExpertLoading(true);
    try {
      const response = await fetch(`/api/market/validate-expert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 404) {
        const errorMessage =
          "You are not an expert on Market.dev. Make sure you have an account created on Market.dev.";
        setValidateMarketExpertError(errorMessage);
        return;
      }

      if (response.status !== 200) {
        const errorMessage = "Failed to validate your Market.dev account.";
        setValidateMarketExpertError(errorMessage);
        return;
      }

      await refreshAndGetState();
      toast.success("Market.dev account connected successfully");
    } catch (error) {
      const errorMessage = "Error validating your Market.dev account.";
      setValidateMarketExpertError(errorMessage);
    } finally {
      setValidateMarketExpertLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    validateMarketExpert();
  }, [mounted]);

  return (
    <div className="flex w-full items-center justify-center">
      {validateMarketExpertLoading ? (
        <div className="flex h-10 w-10 items-center justify-center">
          <LoadingDots />
        </div>
      ) : validateMarketExpertError ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
          <AlertCircleIcon className="h-5 w-5" />
          <p className="text-md">{validateMarketExpertError}</p>
          <Button
            className="bg-gray-900 text-white hover:bg-gray-800"
            onClick={() => window.location.reload()}
          >
            Try again
          </Button>
        </div>
      ) : (
        <MarketDevProfileForm
          user={user}
          currentSite={currentSite}
          onComplete={onComplete}
        />
      )}
    </div>
  );
}
