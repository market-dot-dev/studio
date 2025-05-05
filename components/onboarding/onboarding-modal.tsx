"use client";

import { updateCurrentUser } from "@/app/services/UserService";
import { refreshAndGetState } from "@/app/services/onboarding/OnboardingService";
import { OnboardingState } from "@/app/services/onboarding/onboarding-steps";
import { createSite } from "@/app/services/registration-service";
import { updateCurrentSite } from "@/app/services/site-crud-service";
import { useMarketExpert } from "@/components/dashboard/dashboard-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Site, User } from "@prisma/client";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/themes";
import { AlertCircleIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoadingDots from "../icons/loading-dots";
import OfferingsForm from "./offerings-form";
import ProfileForm from "./profile-form";

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

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

// Internal UI components
const LoadingState = () => (
  <div className="flex size-10 items-center justify-center">
    <LoadingDots />
  </div>
);

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="flex size-full flex-col items-center justify-center gap-4">
    <AlertCircleIcon className="size-5" />
    <p className="text-md">{error}</p>
    <Button onClick={onRetry}>Try again</Button>
  </div>
);

const FormContent = ({
  step,
  user,
  currentSite,
  isLoading,
  onProfileSubmit,
  onOfferingsSubmit
}: {
  step: "profile" | "offerings";
  user: User;
  currentSite?: Site;
  isLoading: boolean;
  onProfileSubmit: (data: ProfileData) => void;
  onOfferingsSubmit: (data: OfferingsData) => void;
}) => (
  <div className="w-full overflow-y-auto">
    <div className="flex w-full items-center justify-center p-6 sm:p-9">
      {step === "profile" ? (
        <ProfileForm user={user} currentSite={currentSite} onSubmit={onProfileSubmit} />
      ) : (
        <OfferingsForm user={user} onSubmit={onOfferingsSubmit} isLoading={isLoading} />
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

export default function OnboardingModal({
  user,
  currentSite,
  onboardingState
}: {
  user: User;
  currentSite?: Site;
  onboardingState: OnboardingState;
}) {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(
    !onboardingState.setupBusiness ||
      !onboardingState.preferredServices ||
      (!user.marketExpertId && searchParams.get("source") === "market.dev")
  );
  const { isMarketExpert, isLoadingMarketExpert, validateMarketExpert } = useMarketExpert();
  const [validateMarketExpertError, setValidateMarketExpertError] = useState<string | null>(null);
  const [step, setStep] = useState<"profile" | "offerings">("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const router = useRouter();
  const source = searchParams.get("source");
  const sourceIsMarketDev = source === "market.dev";
  const mounted = useMounted();

  useEffect(() => {
    if (!mounted || !sourceIsMarketDev || isMarketExpert !== null) return;

    const connectMarketExpert = async () => {
      try {
        const success = await validateMarketExpert();
        if (success && sourceIsMarketDev) {
          toast.success("Market.dev account connected successfully");
        } else if (!success && sourceIsMarketDev) {
          setValidateMarketExpertError(
            "Failed to connect your Market.dev account. Make sure you have an account on Market.dev."
          );
        }
      } catch (error) {
        setValidateMarketExpertError("Error connecting to market.dev");
      }
    };

    connectMarketExpert();
  }, [mounted, sourceIsMarketDev, isMarketExpert, validateMarketExpert]);

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
        businessType: profileData.teamType
      });

      if (currentSite) {
        const formData = new FormData();
        formData.append("subdomain", profileData.subdomain);
        if (profileData.logo) {
          formData.append("logoURL", profileData.logo);
        }
        await updateCurrentSite(formData);
      } else {
        await createSite(user, profileData.subdomain, profileData.logo);
      }

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
    const form = document.querySelector("form");
    if (form) {
      form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }
  };

  const handleRetry = () => window.location.reload();

  // Note: unless source is market.dev where user is intentionally trying to connect their market.dev account, we shouldn't surface connection errors
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
        {isLoadingMarketExpert ? (
          <LoadingState />
        ) : sourceIsMarketDev && validateMarketExpertError ? (
          <ErrorState error={validateMarketExpertError} onRetry={handleRetry} />
        ) : (
          <>
            <FormContent
              step={step}
              user={user}
              currentSite={currentSite}
              isLoading={isLoading}
              onProfileSubmit={handleProfileSubmit}
              onOfferingsSubmit={handleFinalSubmit}
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
        )}
      </DialogContent>
    </Dialog>
  );
}
