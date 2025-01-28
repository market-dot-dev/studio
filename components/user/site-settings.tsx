"use client";
import { Flex, Text, TextInput, Button } from "@tremor/react";
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
  const siteURL = `https://` + site.subdomain + `.store.dev`;

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Flex
          flexDirection="col"
          alignItems="start"
          className="w-full space-y-6"
        >
          <Flex flexDirection="col" alignItems="start" className="w-1/2 gap-2">
            <label
              htmlFor="subdomain"
              className="block text-sm font-medium text-gray-700"
            >
              Subdomain
            </label>
            <TextInput
              placeholder="Your subdomain"
              name="subdomain"
              id="subdomain"
              defaultValue={site.subdomain ?? ""}
            />
            <Text>
              Your store will appear at{" "}
              <Link className="underline" href={siteURL}>
                {siteURL}.
              </Link>
            </Text>
          </Flex>
          <Flex flexDirection="col" alignItems="start" className="w-1/2 gap-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <TextInput
              placeholder="Title of your store"
              name="name"
              id="name"
              defaultValue={site.name ?? ""}
            />
          </Flex>
          <Flex flexDirection="col" alignItems="start" className="w-1/2 gap-2">
            <label
              htmlFor="logo"
              className="block text-sm font-medium text-gray-700"
            >
              Logo
            </label>
            <Text>
              Your store logo is used in your web storefront, for favicons and Open Graph
              images.
            </Text>

            <Uploader
              defaultValue={site.logo ?? null}
              name="logo"
              setChanged={setChanged}
            />
          </Flex>

          <Button type="submit" loading={isSaving} disabled={isSaving}>
            Save Changes
          </Button>
        </Flex>
      </form>
    </>
  );
}
