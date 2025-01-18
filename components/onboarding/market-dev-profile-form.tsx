import Image from "next/image";
import { Button } from "@tremor/react";
import { useState } from "react";
import { Site, User } from "@prisma/client";
import {
  updateCurrentSite,
  validateSubdomain,
} from "@/app/services/SiteService";
import { toast } from "sonner";
import { isGitWalletError } from "@/lib/errors";
import * as Sentry from "@sentry/nextjs";
import { updateCurrentUser } from "@/app/services/UserService";
import { createSite } from "@/app/services/registration-service";
import { refreshAndGetState } from "@/app/services/onboarding/OnboardingService";
import TeamSelectionRadioGroup, {
  TeamType,
} from "./team-selection-radio-group";
import LocationEntryInput from "./location-entry-input";
import BusinessNameInput from "./business-name-input";
import ConnectMarketDevAccountButton from "../channels/market/connect-market-dev-account-button";

interface ProfileData {
  businessName: string;
  subdomain: string;
  location: string;
  teamType: TeamType;
}

interface ProfileFormProps {
  user: User;
  onComplete: () => void;
  currentSite?: Site;
}

export default function MarketDevProfileForm({
  user,
  onComplete,
  currentSite,
}: ProfileFormProps) {
  const [teamType, setTeamType] = useState<"team" | "individual" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMarketDevAccountConnected, setIsMarketDevAccountConnected] =
    useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target as HTMLFormElement;
    const subdomain = (form.businessName.value as string).toLocaleLowerCase();
    await validateSubdomain(subdomain, currentSite);

    const profileData: ProfileData = {
      businessName: form.businessName.value,
      subdomain,
      location: form.location.value,
      teamType: teamType!,
    };

    try {
      await updateCurrentUser({
        projectName: profileData.businessName,
        businessLocation: profileData.location,
        businessType: profileData.teamType,
      });

      if (currentSite) {
        const formData = new FormData();
        formData.append("subdomain", profileData.subdomain);
        await updateCurrentSite(formData);
      } else {
        await createSite(user, profileData.subdomain);
      }

      await refreshAndGetState([]);
      onComplete();
    } catch (error) {
      if (isGitWalletError(error)) {
        toast.error(error.message);
      } else {
        console.error(error);
        Sentry.captureException(error);
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form className="w-full max-w-lg" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-8">
        <div className="flex justify-center">
          <Image
            src="/gw-logo-nav.png"
            alt="Gitwallet Logo"
            className="h-16 w-16 shrink-0"
            height={48}
            width={48}
          />
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
            Tell us about your business
          </h1>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <label className="block text-sm text-gray-900">
              Connect your Market.dev account
            </label>
            <ConnectMarketDevAccountButton
              user={user}
              onComplete={() => setIsMarketDevAccountConnected(true)}
            />
          </div>
          <BusinessNameInput userGithubUsername={user.gh_username} />
          <LocationEntryInput />
          <TeamSelectionRadioGroup
            teamType={teamType}
            setTeamType={setTeamType}
          />
        </div>

        <div className="flex w-full justify-end pt-6">
          <Button
            className="bg-gray-900 text-white hover:bg-gray-800"
            type="submit"
            loading={isLoading}
            disabled={isLoading || !isMarketDevAccountConnected}
          >
            Next
          </Button>
        </div>
      </div>
    </form>
  );
}
