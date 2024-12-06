"use client";

import Modal from "@/components/common/modal";
import OnboardingForm from "./onboarding-form";
import { Site, User } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function OnboardingModal({
  user,
  currentSite,
  defaultOpen = true,
}: {
  user: User;
  currentSite?: Site;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const router = useRouter();

  return (
    <Modal isOpen={isOpen} showCloseButton={false}>
      <OnboardingForm
        user={user}
        currentSite={currentSite}
        onComplete={async () => {
          setIsOpen(false);
          router.refresh();
        }}
      />
    </Modal>
  );
}
