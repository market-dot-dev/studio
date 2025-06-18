import { User } from "@/app/generated/prisma";
import { uploadLogo } from "@/app/services/site/site-media-service";
import { validateSubdomain } from "@/app/services/site/site-subdomain-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getRootUrl } from "@/lib/domain";
import { isGitWalletError } from "@/lib/errors";
import type { SiteDetails } from "@/types/site";
import * as Sentry from "@sentry/nextjs";
import clsx from "clsx";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import LocationEntryInput from "./location-entry-input";
import TeamSelectionRadioGroup, { TeamType } from "./team-selection-radio-group";

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
  currentSite?: SiteDetails;
  formRef?: React.RefObject<HTMLFormElement | null>;
}

export default function ProfileForm({ user, onSubmit, currentSite, formRef }: ProfileFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDraggingOverDropzone, setIsDraggingOverDropzone] = useState(false);
  const [teamType, setTeamType] = useState<TeamType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const defaultLogoUrl = `${getRootUrl("/gw-logo.png")}`;

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
        logo
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
    <form ref={formRef} className="relative w-full" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex justify-center">
            <Image
              src="/gw-logo-nav.png"
              alt="Gitwallet Logo"
              className="size-9 shrink-0"
              height={36}
              width={36}
            />
          </div>

          <div className="space-y-1 text-center">
            <h1 className="text-xl font-bold tracking-tightish text-stone-800">
              Welcome to market.dev
            </h1>
            <h2 className="text-sm font-normal text-stone-500">Tell us about your business</h2>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              name="businessName"
              defaultValue={user.gh_username ?? ""}
              placeholder={"Business Name"}
              className="bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subdomain">Domain</Label>
            <div className="flex items-center justify-between gap-4 rounded bg-white shadow-border-sm">
              <Input
                id="subdomain"
                className="rounded-r-none shadow-none"
                defaultValue={currentSite?.subdomain ?? user.gh_username ?? ""}
                disabled={!!currentSite?.subdomain}
                placeholder={"Subdomain"}
                name="subdomain"
                required
              />
              <span className="pr-3 text-sm text-stone-400">.market.dev</span>
            </div>
            {/* {subdomainError && (
              <p className="text-sm text-red-500">{subdomainError}</p>
            )} */}
            <p className="text-xs text-stone-500">
              Your landing page will live here. You can change this later.
            </p>
          </div>

          <div className="space-y-2">
            <Label>
              Logo
              <span className="ml-1 text-xs font-normal text-stone-500">(Optional)</span>
            </Label>
            <div
              className={clsx(
                "rounded-lg border border-dashed bg-stone-150 p-10 text-center transition-colors",
                isDraggingOverDropzone ? "border-stone-400" : "border-stone-300"
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
              {file || (currentSite?.logo && currentSite.logo !== defaultLogoUrl) ? (
                <div className="mx-auto flex flex-col items-center">
                  <Image
                    src={file ? URL.createObjectURL(file) : (currentSite!.logo ?? "")}
                    alt="Selected file preview"
                    height={80}
                    width={80}
                    className="h-20 w-auto rounded shadow-sm ring-1 ring-black/10"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="link"
                    onClick={handleFilePicker}
                    className="mt-4 text-xs text-stone-500"
                  >
                    Pick another image
                  </Button>
                </div>
              ) : (
                <div className="mx-auto flex flex-col items-center">
                  <ImageIcon className="mx-auto size-6 text-stone-400" />
                  <div className="mt-3 text-xs text-stone-500">
                    <p>Drag & drop a .png or .jpg</p>
                    <p>
                      or{" "}
                      <Button
                        type="button"
                        variant="link"
                        onClick={handleFilePicker}
                        className="!h-fit cursor-pointer p-0 text-xs font-semibold underline"
                      >
                        pick an image
                      </Button>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <LocationEntryInput />
          <TeamSelectionRadioGroup teamType={teamType} setTeamType={setTeamType} />
        </div>
      </div>
    </form>
  );
}
