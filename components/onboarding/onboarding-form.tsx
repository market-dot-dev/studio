"use client";

import { useState } from "react";
import { Site, User } from "@prisma/client";
import OfferingsForm from "./offerings-form";
import ProfileForm from "./profile-form";
import { updateCurrentUser } from "@/app/services/UserService";
import { createSite } from "@/app/services/registration-service";
import { updateCurrentSite } from "@/app/services/SiteService";
import { refreshAndGetState } from "@/app/services/onboarding/OnboardingService";

interface ProfileData {
  businessName: string;
  subdomain: string;
  logo?: string;
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
      await updateCurrentUser({
        projectName: profileData.businessName,
        businessLocation: profileData.location,
        businessType: profileData.teamType,
      });

      if (currentSite) {
        const formData = new FormData();
        formData.append("subdomain", profileData.subdomain);
        if (profileData.logo) {
          formData.append("logo", profileData.logo);
        }
        await updateCurrentSite(formData);
      } else {
        await createSite(user, profileData.subdomain, profileData.logo);
      }

      await refreshAndGetState(offeringsData.offerings);
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
