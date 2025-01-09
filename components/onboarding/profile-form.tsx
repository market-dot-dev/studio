import Image from "next/image";
import clsx from "clsx";
import { TextInput, Button } from "@tremor/react";
import { UsersRound, UserRound, ImageIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Site, User } from "@prisma/client";
import { uploadLogo, validateSubdomain } from "@/app/services/SiteService";
import { toast } from "sonner";
import { isGitWalletError } from "@/lib/errors";
import * as Sentry from "@sentry/nextjs";
import { DEFAULT_LOGO_URL } from "@/lib/user";

interface ProfileData {
  businessName: string;
  subdomain: string;
  logo?: string;
  location: string;
  teamType: "team" | "individual";
}

interface ProfileFormProps {
  user: User;
  onSubmit: (data: ProfileData) => void;
  currentSite?: Site;
}

export default function ProfileForm({
  user,
  onSubmit,
  currentSite,
}: ProfileFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDraggingOverDropzone, setIsDraggingOverDropzone] = useState(false);
  const [teamType, setTeamType] = useState<"team" | "individual" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOverDropzone(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOverDropzone(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOverDropzone(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const subdomain = (form.subdomain.value as string).toLocaleLowerCase();

    try {
      setIsLoading(true);
      await validateSubdomain(subdomain, currentSite);

      let logo: string | undefined;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        logo = await uploadLogo(formData);
      }

      onSubmit({
        businessName: form.businessName.value,
        subdomain,
        location: form.location.value,
        teamType: teamType!,
        logo,
      });
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
            Welcome to Gitwallet
          </h1>
          <h2 className="text-2xl font-normal text-gray-900">
            Tell us about your business
          </h2>
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
            <label className="block text-sm text-gray-900">Domain</label>
            <div className="flex items-center justify-between gap-4 rounded-tremor-default border border-tremor-border bg-white shadow-tremor-input">
              <TextInput
                className="rounded-r-none border-none bg-white shadow-none focus:border focus:border-gray-900"
                defaultValue={currentSite?.subdomain ?? user.gh_username ?? ""}
                disabled={!!currentSite?.subdomain}
                placeholder={"Subdomain"}
                name="subdomain"
                required
              />
              <span className="py-2 pr-3 text-sm text-gray-400">
                .store.dev
              </span>
            </div>
            {/* {subdomainError && (
              <p className="text-sm text-red-500">{subdomainError}</p>
            )} */}
            <p className="text-xs text-gray-500">
              Your landing page will live here. You can change this later.
            </p>
          </div>

          <div className="space-y-2">
            <label className="flex items-baseline justify-between text-sm text-gray-900">
              Logo
              <span className="ml-2 text-xs text-gray-500">Optional</span>
            </label>
            <div
              className={clsx(
                "rounded-lg border border-dashed bg-gray-100 p-10 text-center transition-colors",
                isDraggingOverDropzone ? "border-gray-400" : "border-gray-300",
              )}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              {file ||
              (currentSite?.logo && currentSite.logo !== DEFAULT_LOGO_URL) ? (
                <div className="mx-auto flex flex-col items-center">
                  <Image
                    src={
                      file ? URL.createObjectURL(file) : currentSite!.logo ?? ""
                    }
                    alt="Selected file preview"
                    height={80}
                    width={80}
                    className="h-20 w-auto rounded shadow-sm ring-1 ring-black/10"
                  />
                  <button
                    type="button"
                    onClick={handleFilePicker}
                    className="mt-4 text-xs text-gray-500 underline"
                  >
                    Pick another image
                  </button>
                </div>
              ) : (
                <div className="mx-auto flex flex-col items-center">
                  <ImageIcon className="mx-auto h-6 w-6 text-gray-400" />
                  <div className="mt-3 text-xs text-gray-500">
                    <p>Drag & drop a .png or .jpg</p>
                    <p>
                      or{" "}
                      <button
                        type="button"
                        onClick={handleFilePicker}
                        className="cursor-pointer underline"
                      >
                        pick an image
                      </button>
                    </p>
                  </div>
                </div>
              )}
            </div>
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
