"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

// Define the onboarding steps and their navigation
const ONBOARDING_STEPS = {
  "/onboarding/organization": {
    isFirst: true,
    previous: null
  },
  "/onboarding/stripe": {
    isFirst: false,
    previous: "/onboarding/organization"
  },
  "/onboarding/links": {
    isFirst: false,
    previous: "/onboarding/stripe"
  },
  "/onboarding/complete": {
    isFirst: false,
    previous: "/onboarding/links"
  }
} as const;

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const currentStep = ONBOARDING_STEPS[pathname as keyof typeof ONBOARDING_STEPS];
  const showBackButton = currentStep && !currentStep.isFirst;

  const handleBack = () => {
    if (currentStep?.previous) {
      router.push(currentStep.previous);
    }
  };

  return (
    <div className="min-h-screen bg-stone-150 px-6 pb-12 pt-6">
      <div className="relative mx-auto max-w-md">
        <div className=" mb-6 flex w-full items-center justify-center">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="absolute -left-2.5 top-0.5 size-8  text-stone-600 hover:text-stone-700"
            >
              <ChevronLeft className="size-7 -translate-x-px" />
            </Button>
          )}

          <Image
            alt="market.dev logo"
            width={36}
            height={36}
            className="size-9"
            src="/gw-logo-nav.png"
            priority
          />
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
