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
  return (
    <div className="flex w-full items-center justify-center">
      <EchoProfileForm
        user={user}
        currentSite={currentSite}
        onComplete={onComplete}
      />
    </div>
  );
}
