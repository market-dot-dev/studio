"use client";

import { useState } from "react";
import { User } from "@prisma/client";
import Image from "next/image";
import { Button } from "@tremor/react";

export default function EchoOnboardingForm({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/echo/validate-expert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      // TODO: set Onboarding State
    } catch (error) {
      const errorStr = `Failed to complete echo onboarding: ${error}`;
      setError(errorStr);
      console.error(errorStr);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center">
      <form className="w-full max-w-lg" onSubmit={handleSubmit}>
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
            <h2 className="text-2xl font-normal text-gray-900">
              Let's connect your Echo account so you can start selling your
              services on Echo
            </h2>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              {/* <p className="block text-sm text-gray-900">
                
              </p> */}
              <Button
                onClick={handleSubmit}
                loading={isLoading}
                disabled={isLoading}
              >
                Connect Echo Account
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
