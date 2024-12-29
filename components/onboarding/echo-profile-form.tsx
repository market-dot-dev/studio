import Image from "next/image";
import { TextInput, Button } from "@tremor/react";
import { UsersRound, UserRound } from "lucide-react";
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

interface ProfileData {
  businessName: string;
  subdomain: string;
  location: string;
  teamType: "team" | "individual";
}

interface ProfileFormProps {
  user: User;
  onComplete: () => void;
  currentSite?: Site;
}

export default function ProfileForm({
  user,
  onComplete,
  currentSite,
}: ProfileFormProps) {
  const [teamType, setTeamType] = useState<"team" | "individual" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
            <label className="block text-sm text-gray-900">Business Name</label>
            <TextInput
              name="businessName"
              defaultValue={user.gh_username ?? ""}
              placeholder={"Business Name"}
              className="bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-900">
              Where are you based out of?
            </label>
            <TextInput
              placeholder="Toronto, Canada"
              className="bg-white text-gray-900"
              name="location"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-900">
              Are you a team or independent?
            </label>
            <div className="space-y-2">
              <label className="block w-full rounded-tremor-default focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-200">
                <div className="flex cursor-pointer items-center justify-between rounded-tremor-default border bg-white p-4 shadow-sm hover:bg-gray-50 [&:has(input:checked)]:border-marketing-swamp [&:has(input:checked)]:ring-1 [&:has(input:checked)]:ring-marketing-swamp">
                  <div className="flex items-center">
                    <UsersRound className="mr-3 h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-900">
                      We&apos;re a team
                    </span>
                  </div>
                  <input
                    type="radio"
                    name="team-type"
                    value="team"
                    checked={teamType === "team"}
                    onChange={(e) => setTeamType("team")}
                    required
                    className="text-gray-500 checked:text-marketing-swamp focus:outline-none focus:ring-0"
                  />
                </div>
              </label>
              <label className="block w-full rounded-tremor-default focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-200">
                <div className="flex cursor-pointer items-center justify-between rounded-tremor-default border bg-white p-4 shadow-sm hover:bg-gray-50 [&:has(input:checked)]:border-marketing-swamp [&:has(input:checked)]:ring-1 [&:has(input:checked)]:ring-marketing-swamp">
                  <div className="flex items-center">
                    <UserRound className="mr-3 h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-900">
                      It&apos;s just me
                    </span>
                  </div>
                  <input
                    type="radio"
                    name="team-type"
                    value="individual"
                    checked={teamType === "individual"}
                    onChange={(e) => setTeamType("individual")}
                    required
                    className="text-gray-500 checked:text-marketing-swamp focus:outline-none focus:ring-0"
                  />
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex w-full justify-end pt-6">
          <Button
            className="bg-gray-900 text-white hover:bg-gray-800"
            type="submit"
            loading={isLoading}
            disabled={isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </form>
  );
}
