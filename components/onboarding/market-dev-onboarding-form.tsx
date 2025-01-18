"use client";

import { User } from "@prisma/client";
import { Site } from "@prisma/client";
import MarketDevProfileForm from "./market-dev-profile-form";

export default function MarketDevOnboardingForm({
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
      <MarketDevProfileForm
        user={user}
        currentSite={currentSite}
        onComplete={onComplete}
      />
    </div>
  );
}
