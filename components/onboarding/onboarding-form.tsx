"use client";

import { useState, useRef, useEffect } from "react";

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

import OfferingsForm from "./offerings-form";
import ProfileForm from "./profile-form";
import { createSite } from "@/tests/factories";
import { updateCurrentUser } from "@/app/services/UserService";

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

export default function OnboardingForm({ user }: { user: User }) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"profile" | "offerings">("profile");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    // TODO: Add logic to check if the user has already completed onboarding and redirect to dashboard if so
  }, [user.projectName, router]);

  const handleProfileSubmit = (data: ProfileData) => {
    setProfileData(data);
    setStep("offerings");
  };

  const handleFinalSubmit = async (offeringsData: OfferingsData) => {
    if (!profileData) return;

    setIsLoading(true);
    try {
      // Submit both profile and offerings data
      await updateCurrentUser({
        projectName: profileData.businessName,
        businessLocation: profileData.location,
        businessType: profileData.teamType,
        offerings: offeringsData.offerings,
      });

      await createSite(user.id, {
        name: profileData.businessName,
        subdomain: profileData.subdomain,
        image: profileData.logo
          ? URL.createObjectURL(profileData.logo)
          : undefined,
      });

      router.push("/dashboard"); // or wherever you want to redirect after completion
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
        <ProfileForm user={user} onSubmit={handleProfileSubmit} />
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
