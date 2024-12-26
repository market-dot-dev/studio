"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@tremor/react";
import { toast } from "sonner";
import { refreshAndGetState } from "@/app/services/onboarding/OnboardingService";

export default function EchoOnboardingForm({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
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
      onComplete();
      toast.success("Echo account connected successfully");
    } catch (error) {
      toast.error("Error validating your Echo account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center">
      <form className="w-full max-w-lg">
        <div className="flex flex-col gap-8">
          <div className="flex justify-center">
            <Image
              src="/gw-logo-nav.png"
              alt="Gitwallet Logo"
              className="h-16 w-16 shrink-0"
              height={48}
              width={48}
            />
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
              Welcome to Gitwallet
            </h1>
            <h2 className="text-lg font-normal text-gray-800">
              Connect your Echo account so you can start selling your services
            </h2>
          </div>

          <div className="flex w-full items-center justify-center space-y-10">
            <Button
              className="w-30 flex items-center justify-center bg-black text-white"
              onClick={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
            >
              <span>Connect</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
