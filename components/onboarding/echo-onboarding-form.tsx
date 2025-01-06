"use client";

import { User } from "@prisma/client";
import { Site } from "@prisma/client";
import EchoProfileForm from "./echo-profile-form";
import { useEffect, useState, useRef } from "react";
import { refreshAndGetState } from "@/app/services/onboarding/OnboardingService";
import { toast } from "sonner";
import LoadingDots from "../icons/loading-dots";

export default function EchoOnboardingForm({
  user,
  currentSite,
  onComplete,
}: {
  user: User;
  currentSite?: Site;
  onComplete: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const hasValidated = useRef(false);

  const validateEchoExpert = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/echo/validate-expert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 404) {
        toast.error(
          "You are not an expert on Echo. Make sure you have an account created on Echo.",
        );
        return;
      }

      if (response.status !== 200) {
        toast.error("Failed to validate your Echo account. Please try again.");
        return;
      }

      await refreshAndGetState();
      toast.success("Echo account connected successfully");
    } catch (error) {
      toast.error("Error validating your Echo account. Please try again.");
      onComplete();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user.echoExpertId && !hasValidated.current) {
      validateEchoExpert();
      hasValidated.current = true;
    }
  }, [user.echoExpertId]);

  return (
    <div className="flex w-full items-center justify-center">
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <LoadingDots />
        </div>
      ) : (
        <EchoProfileForm
          user={user}
          currentSite={currentSite}
          onComplete={onComplete}
        />
      )}
    </div>
  );
}
