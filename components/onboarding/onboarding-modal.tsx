"use client";

import Modal from "@/components/common/modal";
import OnboardingForm from "./onboarding-form";
import { Site, User } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OnboardingState } from "@/app/services/onboarding/onboarding-steps";
import { refreshAndGetState } from "@/app/services/onboarding/OnboardingService";
import { toast } from "sonner";
import LoadingDots from "../icons/loading-dots";
import { AlertCircleIcon } from "lucide-react";
import { Button } from "@tremor/react";

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export default function OnboardingModal({
  user,
  currentSite,
  onboardingState,
}: {
  user: User;
  currentSite?: Site;
  onboardingState: OnboardingState;
}) {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(
    !onboardingState.setupBusiness ||
      !onboardingState.preferredServices ||
      (!user.marketExpertId && searchParams.get("source") === "market.dev"),
  );
  const [validateMarketExpertLoading, setValidateMarketExpertLoading] =
    useState(true);
  const [validateMarketExpertError, setValidateMarketExpertError] = useState<
    string | null
  >(null);

  const router = useRouter();
  const source = searchParams.get("source");
  const sourceIsMarketDev = source === "market.dev";
  const mounted = useMounted();

  const validateMarketExpert = async () => {
    if (user.marketExpertId) {
      setValidateMarketExpertLoading(false);
      return;
    }

    setValidateMarketExpertLoading(true);
    try {
      const response = await fetch(`/api/market/validate-expert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const errorMessages = {
        404: "You are not an expert on Market.dev. Make sure you have an account created on Market.dev.",
        default: "Failed to validate your Market.dev account.",
      };

      if (!response.ok) {
        throw new Error(
          errorMessages[response.status as keyof typeof errorMessages] ||
            errorMessages.default,
        );
      }

      await refreshAndGetState();
      if (sourceIsMarketDev) {
        toast.success("Market.dev account connected successfully");
      }
    } catch (error) {
      setValidateMarketExpertError(
        error instanceof Error
          ? error.message
          : "Error validating your Market.dev account.",
      );
      throw error;
    } finally {
      setValidateMarketExpertLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    validateMarketExpert().catch(() => {
      setValidateMarketExpertLoading(false);
    });
  }, [mounted]);

  // Note: unless source is market.dev where user is intentionally trying to connect their market.dev account, we shouldn't surface connection errors
  return (
    <Modal isOpen={isOpen} maxWidth="max-w-xl" showCloseButton={false}>
      {validateMarketExpertLoading ? (
        <div className="flex h-10 w-10 items-center justify-center">
          <LoadingDots />
        </div>
      ) : sourceIsMarketDev && validateMarketExpertError ? (
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
        <OnboardingForm
          user={user}
          currentSite={currentSite}
          onComplete={async () => {
            setIsOpen(false);
            router.refresh();
          }}
        />
      )}
    </Modal>
  );
}
