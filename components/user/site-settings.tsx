"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Site } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { updateCurrentSite } from "@/app/services/SiteService"; // Ensure this service is implemented correctly
import Uploader from "../form/uploader";
import { toast } from "sonner";
import * as Sentry from "@sentry/nextjs";
import { isGitWalletError } from "@/lib/errors";

export default function SiteSettings({ site }: { site: Partial<Site> }) {
  const [isSaving, setIsSaving] = useState(false);
  const [changed, setChanged] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setIsSaving(true);

    const formData = new FormData(e.target);
    // if not changed, remove the logo from the form data
    if (!changed) {
      formData.delete("logo");
    }
    try {
      await updateCurrentSite(formData);
      setChanged(false);
      toast.success("Store updated");
    } catch (error) {
      if (isGitWalletError(error)) {
        toast.error(error.message);
      } else {
        console.error(error);
        Sentry.captureException(error);
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsSaving(false);
    }
  };
  const siteURL = `https://` + site.subdomain + `.market.dev`;

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col items-start w-full space-y-6">
        <div className="flex flex-col items-start w-1/2 gap-2">
          <div>
            <Label htmlFor="subdomain" className="mb-0.5">
              Subdomain
            </Label>
            <p className="text-xs text-stone-500">
              Your store will appear at{" "}
              <Link className="underline" href={siteURL}>
                {siteURL}.
              </Link>
            </p>
          </div>
          <Input
            placeholder="Your subdomain"
            name="subdomain"
            id="subdomain"
            defaultValue={site.subdomain ?? ""}
          />
        </div>
        <div className="flex flex-col items-start w-1/2 gap-1.5">
          <Label htmlFor="name">
            Name
          </Label>
          <Input
            placeholder="Your store title"
            name="name"
            id="name"
            defaultValue={site.name ?? ""}
          />
        </div>
        <div className="flex flex-col items-start w-1/2 gap-2">
          <div>
            <Label htmlFor="logo" className="mb-0.5">
              Logo
            </Label>
            <p className="text-xs text-stone-500">
              Your store logo is used in your web storefront, for favicons and Open Graph
              images.
            </p>
          </div>

          <Uploader
            defaultValue={site.logo ?? null}
            name="logo"
            setChanged={setChanged}
          />
        </div>

        <Button 
          type="submit" 
          loading={isSaving}
          loadingText="Saving Changes"
        >
          Save
        </Button>
      </div>
    </form>
  );
}
