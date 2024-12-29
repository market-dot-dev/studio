"use client";

import Modal from "@/components/common/modal";
import OnboardingForm from "./onboarding-form";
import { Site, User } from "@prisma/client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OnboardingState } from "@/app/services/onboarding/onboarding-steps";
import EchoOnboardingForm from "./echo-onboarding-form";
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
      (!onboardingState.echoProfileConnected &&
        searchParams.get("onboardingType") === "echo"),
  );
  const router = useRouter();
  const onboardingType = searchParams.get("onboardingType");

  return (
    <Modal isOpen={isOpen} showCloseButton={false}>
      {onboardingType === "echo" ? (
        <EchoOnboardingForm
          user={user}
          currentSite={currentSite}
          onComplete={async () => {
            setIsOpen(false);
            router.refresh();
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
