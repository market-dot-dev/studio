import { Button } from "@tremor/react";
import { toast } from "sonner";
import { useState } from "react";
import { refreshAndGetState } from "@/app/services/onboarding/OnboardingService";
import { User } from "@prisma/client";

export default function ConnectMarketDevAccountButton({
  user,
  onComplete,
}: {
  user: User;
  onComplete: () => void;
}) {
  const [validateMarketExpertLoading, setValidateMarketExpertLoading] =
    useState(false);
  const [isMarketExpertValidated, setIsMarketExpertValidated] = useState(
    user.marketExpertId ? true : false,
  );

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
        toast.error(
          "You are not an expert on Market.dev. Make sure you have an account created on Market.dev.",
        );
        return;
      }

      if (response.status !== 200) {
        toast.error(
          "Failed to validate your Market.dev account. Please try again.",
        );
        return;
      }

      await refreshAndGetState();
      setIsMarketExpertValidated(true);
      onComplete();
      toast.success("Market.dev account connected successfully");
    } catch (error) {
      toast.error(
        "Error validating your Market.dev account. Please try again.",
      );
    } finally {
      setValidateMarketExpertLoading(false);
    }
  };

  return (
    <Button
      className="bg-gray-900 text-white hover:bg-gray-800"
      disabled={isMarketExpertValidated}
      loading={validateMarketExpertLoading}
      onClick={validateMarketExpert}
    >
      Connect
    </Button>
  );
}
