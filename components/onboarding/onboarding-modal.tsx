"use client";

import Modal from "@/components/common/modal";
import OnboardingForm from "./onboarding-form";
import { Site, User } from "@prisma/client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OnboardingState } from "@/app/services/onboarding/onboarding-steps";
import MarketDevOnboardingForm from "./market-dev-onboarding-form";

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
  const router = useRouter();
  const source = searchParams.get("source");

  return (
    <Modal isOpen={isOpen} maxWidth="max-w-xl" showCloseButton={false}>
      {source === "market.dev" ? (
        <MarketDevOnboardingForm
          user={user}
          currentSite={currentSite}
          onComplete={async () => {
            setIsOpen(false);
          }}
        />
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
