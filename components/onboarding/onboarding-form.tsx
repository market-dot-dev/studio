"use client";

import { useState } from "react";
import { Site, User } from "@prisma/client";
import OfferingsForm from "./offerings-form";
import ProfileForm from "./profile-form";
import { updateCurrentUser } from "@/app/services/UserService";
import {
  defaultOnboardingState,
  OnboardingState,
} from "@/app/services/onboarding/onboarding-steps";
import { saveState } from "@/app/services/onboarding/OnboardingService";
import { createSite } from "@/app/services/registration-service";

interface ProfileData {
  businessName: string;
  subdomain: string;
  logo?: File;
  location: string;
  teamType: "team" | "individual";
}

interface OfferingsData {
  offerings: string[];
}

export default function OnboardingForm({
  user,
  currentSite,
  onComplete,
}: {
  user: User;
  currentSite?: Site;
  onComplete: () => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"profile" | "offerings">("profile");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const handleProfileSubmit = (data: ProfileData) => {
    setProfileData(data);
    setStep("offerings");
  };

  const handleFinalSubmit = async (offeringsData: OfferingsData) => {
    if (!profileData) return;

    setIsLoading(true);
    try {
      // TODO: Add image to user table
      await updateCurrentUser({
        projectName: profileData.businessName,
        businessLocation: profileData.location,
        businessType: profileData.teamType,
      });

      if (!currentSite) {
        await createSite(user, profileData.subdomain, "");
      }

      const onboardingState: OnboardingState = user.onboarding
        ? JSON.parse(user.onboarding)
        : defaultOnboardingState;

      const newState = {
        ...onboardingState,
        setupBusiness: true,
        preferredServices: offeringsData.offerings,
      };

      await saveState(newState);
      await onComplete();
    } catch (error) {
      setError("Failed to complete onboarding");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center">
      {step === "profile" ? (
        <ProfileForm
          user={user}
          currentSite={currentSite}
          onSubmit={handleProfileSubmit}
        />
      ) : (
        <OfferingsForm
          user={user}
          onSubmit={handleFinalSubmit}
          onBack={() => setStep("profile")}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
