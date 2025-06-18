"use client";

import { User } from "@/app/generated/prisma";
import { refreshAndGetState } from "@/app/services/onboarding/onboarding-service";
import { OnboardingState } from "@/app/services/onboarding/onboarding-steps";
import { updateCurrentOrganizationBusiness } from "@/app/services/organization/organization-service";
import { createSite, updateCurrentSite } from "@/app/services/site/site-crud-service";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import type { SiteDetails } from "@/types/site";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import OfferingsForm from "./offerings-form";
import ProfileForm from "./profile-form";

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

const FormContent = ({
  step,
  user,
  currentSite,
  isLoading,
  onProfileSubmit,
  onOfferingsSubmit,
  formRef
}: {
  step: "profile" | "offerings";
  user: User;
  currentSite?: SiteDetails;
  isLoading: boolean;
  onProfileSubmit: (data: ProfileData) => void;
  onOfferingsSubmit: (data: OfferingsData) => void;
  formRef: React.RefObject<HTMLFormElement | null>;
}) => (
  <div className="w-full overflow-y-auto">
    <div className="flex w-full items-center justify-center p-6 sm:p-9">
      {step === "profile" ? (
        <ProfileForm
          user={user}
          currentSite={currentSite}
          onSubmit={onProfileSubmit}
          formRef={formRef}
        />
      ) : (
        <OfferingsForm
          user={user}
          onSubmit={onOfferingsSubmit}
          isLoading={isLoading}
          formRef={formRef}
        />
      )}
    </div>
  </div>
);

const NavigationButtons = ({
  step,
  isLoading,
  onBack,
  onSubmit
}: {
  step: "profile" | "offerings";
  isLoading: boolean;
  onBack: () => void;
  onSubmit: () => void;
}) => (
  <div className="flex w-full justify-between">
    {step === "offerings" && (
      <Button variant="ghost" size="lg" onClick={onBack} type="button">
        Back
      </Button>
    )}
    <Button
      type="button"
      size="lg"
      disabled={isLoading}
      loading={isLoading}
      onClick={onSubmit}
      className="ml-auto"
    >
      {step === "profile" ? "Next" : "Finish"}
    </Button>
  </div>
);

type OnboardingModalProps = {
  user: User;
  currentSite?: SiteDetails;
  onboardingState: OnboardingState;
  organization: {
    id: string;
  };
};

export function OnboardingModal({
  user,
  currentSite,
  onboardingState,
  organization
}: OnboardingModalProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [isOpen, setIsOpen] = useState(
    !onboardingState.setupBusiness || !onboardingState.preferredServices
  );

  const [step, setStep] = useState<"profile" | "offerings">("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const router = useRouter();

  const handleProfileSubmit = (data: ProfileData) => {
    setProfileData(data);
    setStep("offerings");
  };

  const handleFinalSubmit = async (offeringsData: OfferingsData) => {
    if (!profileData) return;

    setIsLoading(true);
    try {
      // Update organization business data
      await updateCurrentOrganizationBusiness({
        name: profileData.businessName,
        businessLocation: profileData.location,
        businessType: profileData.teamType
      });

      // Handle site creation/update
      if (currentSite) {
        const formData = new FormData();
        formData.append("subdomain", profileData.subdomain);
        if (profileData.logo) {
          formData.append("logoURL", profileData.logo);
        }
        await updateCurrentSite(formData);
      } else {
        // Create site for the organization
        await createSite(organization.id, profileData.subdomain, profileData.logo);
      }

      // Update onboarding state
      await refreshAndGetState(offeringsData.offerings);

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      setError("Failed to complete onboarding");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitClick = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <VisuallyHidden>
        <DialogTitle>Welcome to market.dev</DialogTitle>
        <DialogDescription>Tell us about your business</DialogDescription>
      </VisuallyHidden>
      <DialogContent
        className="flex max-h-[calc(100vh-32px)] max-w-[calc(100vw-32px)] flex-col items-center rounded-lg bg-stone-100 p-0 sm:max-h-[calc(100vh-48px)] sm:max-w-xl"
        hideCloseButton
        preventOutsideClose
      >
        <>
          <FormContent
            step={step}
            user={user}
            currentSite={currentSite}
            isLoading={isLoading}
            onProfileSubmit={handleProfileSubmit}
            onOfferingsSubmit={handleFinalSubmit}
            formRef={formRef}
          />
          <DialogFooter className="w-full border-t border-stone-200 px-6 py-4 sm:px-9">
            <NavigationButtons
              step={step}
              isLoading={isLoading}
              onBack={() => setStep("profile")}
              onSubmit={handleSubmitClick}
            />
          </DialogFooter>
        </>
      </DialogContent>
    </Dialog>
  );
}
